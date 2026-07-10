import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, test } from 'node:test'

const temporaryDirectories = new Set()
const loadRunner = () => import('../../e2e/run.mjs')

const fixture = async (source) => {
  const directory = await mkdtemp(join(tmpdir(), 'e2e-runner-test-'))
  temporaryDirectories.add(directory)
  const path = join(directory, 'playwright-cli.mjs')
  await writeFile(path, source)
  return { directory, path }
}

const capture = () => {
  let stdout = ''
  let stderr = ''

  return {
    read: () => ({ stderr, stdout }),
    writeStderr: (chunk) => {
      stderr += chunk
    },
    writeStdout: (chunk) => {
      stdout += chunk
    },
  }
}

afterEach(async () => {
  await Promise.all(
    [...temporaryDirectories].map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  )
  temporaryDirectories.clear()
})

describe('runE2E', () => {
  test('propagates selected ports and Playwright arguments', async () => {
    const { runE2E } = await loadRunner()
    const { path } = await fixture(`
      console.log(JSON.stringify({ argv: process.argv.slice(2), env: {
        dev: process.env.E2E_DEV_PORT,
        pages: process.env.E2E_PAGES_PORT,
      }}))
    `)
    const output = capture()

    const result = await runE2E({
      args: ['--project=chromium-dev', '--grep', 'home'],
      env: {},
      playwrightCli: path,
      ...output,
    })

    assert.equal(result.exitCode, 0)
    assert.match(output.read().stdout, /dev=\d+ \(dynamic\)/)
    assert.match(output.read().stdout, /pages=\d+ \(dynamic\)/)
    const childLine = output
      .read()
      .stdout.split('\n')
      .find((line) => line.startsWith('{'))
    const child = JSON.parse(childLine)
    assert.deepEqual(child.argv, [
      'test',
      '--project=chromium-dev',
      '--grep',
      'home',
    ])
    assert.match(child.env.dev, /^\d+$/)
    assert.match(child.env.pages, /^\d+$/)
    assert.notEqual(child.env.dev, child.env.pages)
  })

  test('allocates distinct pairs to concurrent runner instances', async () => {
    const { runE2E } = await loadRunner()
    const { path } = await fixture(`
      await new Promise((resolve) => setTimeout(resolve, 50))
    `)
    const firstOutput = capture()
    const secondOutput = capture()

    const [first, second] = await Promise.all([
      runE2E({ env: {}, playwrightCli: path, ...firstOutput }),
      runE2E({ env: {}, playwrightCli: path, ...secondOutput }),
    ])

    assert.equal(first.exitCode, 0)
    assert.equal(second.exitCode, 0)
    const selectedPorts = [firstOutput, secondOutput].flatMap((output) => {
      const match = output
        .read()
        .stdout.match(/dev=(\d+) \(dynamic\), pages=(\d+) \(dynamic\)/)
      assert.ok(match)
      return match.slice(1).map(Number)
    })
    assert.equal(new Set(selectedPorts).size, selectedPorts.length)
  })

  test('retries a dynamic bind collision with a fresh pair and then succeeds', async () => {
    const { runE2E } = await loadRunner()
    const { directory, path } = await fixture(`
      import { appendFileSync, existsSync, writeFileSync } from 'node:fs'
      const state = process.env.RUNNER_FIXTURE_STATE
      appendFileSync(state + '.ports', process.env.E2E_DEV_PORT + ',' + process.env.E2E_PAGES_PORT + '\\n')
      if (!existsSync(state)) {
        writeFileSync(state, 'failed')
        console.error('E2E_PORT_BIND_FAILED:dev:' + process.env.E2E_DEV_PORT)
        process.exit(1)
      }
    `)
    const state = join(directory, 'state')
    const output = capture()

    const result = await runE2E({
      env: { RUNNER_FIXTURE_STATE: state },
      playwrightCli: path,
      ...output,
    })

    assert.equal(result.exitCode, 0)
    assert.equal(result.attempts, 2)
    assert.match(output.read().stdout, /attempt 2\/3/)
    const attempts = (await readFile(`${state}.ports`, 'utf8'))
      .trim()
      .split('\n')
    assert.equal(attempts.length, 2)
    assert.notEqual(attempts[0], attempts[1])
  })

  test('retries a dynamic collision detected by Playwright before server startup', async () => {
    const { runE2E } = await loadRunner()
    const { directory, path } = await fixture(`
      import { existsSync, writeFileSync } from 'node:fs'
      const state = process.env.RUNNER_FIXTURE_STATE
      if (!existsSync(state)) {
        writeFileSync(state, 'failed')
        console.error(
          'http://127.0.0.1:' + process.env.E2E_PAGES_PORT +
          '/template-vite-react/ is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true in config.webServer.'
        )
        process.exit(1)
      }
    `)
    const output = capture()

    const result = await runE2E({
      env: { RUNNER_FIXTURE_STATE: join(directory, 'state') },
      playwrightCli: path,
      ...output,
    })

    assert.equal(result.exitCode, 0)
    assert.equal(result.attempts, 2)
    assert.match(output.read().stderr, /retrying with a fresh allocation/)
  })

  test('stops after three dynamic bind collisions', async () => {
    const { runE2E } = await loadRunner()
    const { path } = await fixture(`
      console.error('E2E_PORT_BIND_FAILED:pages:' + process.env.E2E_PAGES_PORT)
      process.exit(23)
    `)
    const output = capture()

    const result = await runE2E({ env: {}, playwrightCli: path, ...output })

    assert.equal(result.exitCode, 23)
    assert.equal(result.attempts, 3)
  })

  test('does not retry a bind marker for an explicit port', async () => {
    const { runE2E } = await loadRunner()
    const { path } = await fixture(`
      console.error('E2E_PORT_BIND_FAILED:dev:' + process.env.E2E_DEV_PORT)
      process.exit(17)
    `)
    const output = capture()

    const result = await runE2E({
      env: { E2E_DEV_PORT: '30173' },
      playwrightCli: path,
      ...output,
    })

    assert.equal(result.exitCode, 17)
    assert.equal(result.attempts, 1)
  })

  test('does not retry CI-default bind markers or ordinary failures', async () => {
    const { runE2E } = await loadRunner()
    const marker = await fixture(`
      console.error('E2E_PORT_BIND_FAILED:dev:' + process.env.E2E_DEV_PORT)
      process.exit(19)
    `)
    const failure = await fixture('process.exit(29)')

    const ciResult = await runE2E({
      env: { CI: 'true' },
      playwrightCli: marker.path,
      portDefaults: { dev: 30183, pages: 30184 },
      ...capture(),
    })
    const failureResult = await runE2E({
      env: {},
      playwrightCli: failure.path,
      ...capture(),
    })

    assert.deepEqual(
      { attempts: ciResult.attempts, exitCode: ciResult.exitCode },
      { attempts: 1, exitCode: 19 },
    )
    assert.deepEqual(
      { attempts: failureResult.attempts, exitCode: failureResult.exitCode },
      { attempts: 1, exitCode: 29 },
    )
  })

  test('propagates a timeout-like Playwright exit code without retrying', async () => {
    const { runE2E } = await loadRunner()
    const { path } = await fixture('process.exit(124)')

    const result = await runE2E({
      env: {},
      playwrightCli: path,
      ...capture(),
    })

    assert.deepEqual(
      { attempts: result.attempts, exitCode: result.exitCode },
      { attempts: 1, exitCode: 124 },
    )
  })

  test('forwards termination signals and reports the signal exit code', async () => {
    const { runE2E } = await loadRunner()
    const { directory, path } = await fixture(`
      import { writeFileSync } from 'node:fs'
      process.on('SIGTERM', () => {
        console.log('fixture received SIGTERM')
        process.exit(0)
      })
      writeFileSync(process.env.RUNNER_READY_FILE, 'ready')
      setInterval(() => {}, 1000)
    `)
    const readyFile = join(directory, 'ready')
    const signals = new EventEmitter()
    const output = capture()
    const run = runE2E({
      env: { RUNNER_READY_FILE: readyFile },
      playwrightCli: path,
      signalSource: signals,
      ...output,
    })

    while (true) {
      try {
        await readFile(readyFile)
        break
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }
    signals.emit('SIGTERM')
    const result = await run

    assert.equal(result.exitCode, 143)
    assert.match(output.read().stdout, /fixture received SIGTERM/)
    assert.equal(signals.listenerCount('SIGINT'), 0)
    assert.equal(signals.listenerCount('SIGTERM'), 0)
  })
})
