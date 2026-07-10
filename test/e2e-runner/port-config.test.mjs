import assert from 'node:assert/strict'
import { createServer } from 'node:net'
import { afterEach, describe, test } from 'node:test'

const openServers = new Set()
const reservations = new Set()

const loadPortConfig = () => import('../../e2e/port-config.mjs')

const listen = (port = 0) =>
  new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => {
      openServers.add(server)
      resolve(server)
    })
  })

const close = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      openServers.delete(server)
      if (error) reject(error)
      else resolve()
    })
  })

const freePort = async () => {
  const server = await listen()
  const { port } = server.address()
  await close(server)
  return port
}

afterEach(async () => {
  await Promise.all(
    [...reservations].map((reservation) => reservation.release()),
  )
  reservations.clear()
  await Promise.all([...openServers].map(close))
})

describe('reserveE2EPorts', () => {
  test('reads the runner-selected port pair', async () => {
    const { readE2EPorts } = await loadPortConfig()

    assert.deepEqual(
      readE2EPorts({ E2E_DEV_PORT: '31001', E2E_PAGES_PORT: '31002' }),
      { dev: 31001, pages: 31002 },
    )
  })

  test('requires both runner-selected ports', async () => {
    const { readE2EPorts } = await loadPortConfig()

    assert.throws(
      () => readE2EPorts({ E2E_DEV_PORT: '31001' }),
      /E2E_PAGES_PORT.*must be selected by e2e\/run\.mjs/,
    )
  })

  test('uses valid explicit ports and reports their source', async () => {
    const { reserveE2EPorts } = await loadPortConfig()
    const devPort = await freePort()
    const pagesPort = await freePort()

    const reservation = await reserveE2EPorts({
      env: {
        E2E_DEV_PORT: String(devPort),
        E2E_PAGES_PORT: String(pagesPort),
      },
    })
    reservations.add(reservation)

    assert.deepEqual(reservation.dev, {
      envName: 'E2E_DEV_PORT',
      port: devPort,
      role: 'dev',
      source: 'explicit',
    })
    assert.deepEqual(reservation.pages, {
      envName: 'E2E_PAGES_PORT',
      port: pagesPort,
      role: 'pages',
      source: 'explicit',
    })
  })

  test('uses deterministic defaults only when CI is exactly true', async () => {
    const { reserveE2EPorts } = await loadPortConfig()
    const reservation = await reserveE2EPorts({
      env: { CI: 'true' },
      defaults: { dev: await freePort(), pages: await freePort() },
    })
    reservations.add(reservation)

    assert.equal(reservation.dev.source, 'ci-default')
    assert.equal(reservation.pages.source, 'ci-default')
  })

  test('dynamically allocates distinct local ports', async () => {
    const { reserveE2EPorts } = await loadPortConfig()
    const reservation = await reserveE2EPorts({ env: {} })
    reservations.add(reservation)

    assert.equal(reservation.dev.source, 'dynamic')
    assert.equal(reservation.pages.source, 'dynamic')
    assert.notEqual(reservation.dev.port, reservation.pages.port)
  })

  for (const value of ['', '0', '65536', '1.5', '12x', ' 4173', '+4173']) {
    test(`rejects invalid explicit port ${JSON.stringify(value)}`, async () => {
      const { reserveE2EPorts } = await loadPortConfig()

      await assert.rejects(
        reserveE2EPorts({
          env: { E2E_DEV_PORT: value, E2E_PAGES_PORT: '4174' },
        }),
        (error) => {
          assert.match(error.message, /E2E_DEV_PORT/)
          assert.match(
            error.message,
            new RegExp(
              JSON.stringify(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            ),
          )
          assert.match(error.message, /decimal integer from 1 through 65535/)
          return true
        },
      )
    })
  }

  test('rejects identical selected ports', async () => {
    const { reserveE2EPorts } = await loadPortConfig()
    const port = await freePort()

    await assert.rejects(
      reserveE2EPorts({
        env: {
          E2E_DEV_PORT: String(port),
          E2E_PAGES_PORT: String(port),
        },
      }),
      /E2E_DEV_PORT and E2E_PAGES_PORT.*different/,
    )
  })

  test('rejects an occupied explicit port with corrective action', async () => {
    const { reserveE2EPorts } = await loadPortConfig()
    const occupied = await listen()
    const { port } = occupied.address()

    await assert.rejects(
      reserveE2EPorts({
        env: {
          E2E_DEV_PORT: String(port),
          E2E_PAGES_PORT: String(await freePort()),
        },
      }),
      (error) => {
        assert.match(error.message, /E2E_DEV_PORT/)
        assert.match(error.message, new RegExp(String(port)))
        assert.match(error.message, /already in use/)
        assert.match(error.message, /choose another port/i)
        return true
      },
    )
  })

  test('holds simultaneous reservations and releases them idempotently', async () => {
    const { reserveE2EPorts } = await loadPortConfig()
    const first = await reserveE2EPorts({ env: {} })
    const second = await reserveE2EPorts({ env: {} })
    reservations.add(first)
    reservations.add(second)

    const ports = [
      first.dev.port,
      first.pages.port,
      second.dev.port,
      second.pages.port,
    ]
    assert.equal(new Set(ports).size, ports.length)

    await first.release()
    await first.release()

    const rebound = await Promise.all(
      [first.dev.port, first.pages.port].map((port) => listen(port)),
    )
    await Promise.all(rebound.map(close))
  })

  test('excludes ports used by earlier allocation attempts', async () => {
    const { reserveE2EPorts } = await loadPortConfig()
    const first = await reserveE2EPorts({ env: {} })
    reservations.add(first)
    await first.release()

    const second = await reserveE2EPorts({
      env: {},
      excludePorts: new Set([first.dev.port, first.pages.port]),
    })
    reservations.add(second)

    assert.ok(![first.dev.port, first.pages.port].includes(second.dev.port))
    assert.ok(![first.dev.port, first.pages.port].includes(second.pages.port))
  })
})
