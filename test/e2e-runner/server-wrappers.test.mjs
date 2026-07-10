import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, test } from 'node:test'

const temporaryDirectories = new Set()
const children = new Set()

const listen = (port = 0) =>
  new Promise((resolvePromise, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => resolvePromise(server))
  })

const close = (server) =>
  new Promise((resolvePromise, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolvePromise()
    })
  })

const fixtureDirectory = async () => {
  const directory = await mkdtemp(join(tmpdir(), 'e2e-server-test-'))
  temporaryDirectories.add(directory)
  await mkdir(join(directory, 'dist'))
  await writeFile(join(directory, 'dist', 'index.html'), '<h1>fixture</h1>')
  return directory
}

const spawnServer = (script, { cwd, env }) => {
  const child = spawn(process.execPath, [resolve(script)], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  children.add(child)
  let stdout = ''
  let stderr = ''
  child.stdout.on('data', (chunk) => {
    stdout += chunk
  })
  child.stderr.on('data', (chunk) => {
    stderr += chunk
  })

  const closed = new Promise((resolvePromise) => {
    child.once('close', (code, signal) => {
      children.delete(child)
      resolvePromise({ code, signal })
    })
  })

  return {
    child,
    closed,
    output: () => ({ stderr, stdout }),
  }
}

const waitFor = async (predicate, timeout = 5_000) => {
  const deadline = Date.now() + timeout
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('Timed out waiting for server')
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10))
  }
}

afterEach(async () => {
  for (const child of children) child.kill('SIGKILL')
  await Promise.all(
    [...temporaryDirectories].map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  )
  temporaryDirectories.clear()
})

for (const [role, script] of [
  ['dev', 'e2e/dev-server.mjs'],
  ['pages', 'e2e/pages-static-server.mjs'],
]) {
  test(`${role} server emits a machine-readable bind marker`, async () => {
    const blocker = await listen()
    const { port } = blocker.address()
    const cwd = await fixtureDirectory()
    const server = spawnServer(script, {
      cwd,
      env: {
        E2E_DEV_PORT: String(port),
        E2E_PAGES_PORT: String(port),
      },
    })

    const result = await server.closed
    await close(blocker)

    assert.notEqual(result.code, 0)
    assert.match(
      `${server.output().stdout}\n${server.output().stderr}`,
      new RegExp(`E2E_PORT_BIND_FAILED:${role}:${port}`),
    )
  })
}

test('Pages server closes cleanly on SIGTERM and releases its port', async () => {
  const probe = await listen()
  const { port } = probe.address()
  await close(probe)
  const cwd = await fixtureDirectory()
  const server = spawnServer('e2e/pages-static-server.mjs', {
    cwd,
    env: {
      E2E_DEV_PORT: String(port + 1),
      E2E_PAGES_PORT: String(port),
    },
  })

  await waitFor(() => server.output().stdout.includes('Serving dist at'))
  server.child.kill('SIGTERM')
  const result = await server.closed

  assert.deepEqual(result, { code: 0, signal: null })
  const rebound = await listen(port)
  await close(rebound)
})

test('development server reports a rejected shutdown without an unhandled rejection', async () => {
  const probe = await listen()
  const { port } = probe.address()
  await close(probe)
  const cwd = await fixtureDirectory()
  await writeFile(
    join(cwd, 'vite.config.mjs'),
    `export default {
      plugins: [{
        name: 'reject-close',
        configureServer(server) {
          const close = server.close.bind(server)
          server.close = async () => {
            await close()
            throw new Error('simulated close failure')
          }
        },
      }],
    }`,
  )
  const server = spawnServer('e2e/dev-server.mjs', {
    cwd,
    env: {
      E2E_DEV_PORT: String(port),
      E2E_PAGES_PORT: String(port),
    },
  })

  await waitFor(() => server.output().stdout.includes(String(port)))
  server.child.kill('SIGINT')
  const result = await server.closed

  assert.deepEqual(result, { code: 1, signal: null })
  assert.match(
    server.output().stderr,
    /Failed to close Vite development server: simulated close failure/,
  )
  const rebound = await listen(port)
  await close(rebound)
})
