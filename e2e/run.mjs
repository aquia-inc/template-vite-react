import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

import { E2E_HOST, reserveE2EPorts } from './port-config.mjs'

const MAX_ATTEMPTS = 3
const FORCE_KILL_TIMEOUT_MS = 1_500
const signalExitCodes = { SIGINT: 130, SIGTERM: 143 }

const defaultPlaywrightCli = () =>
  fileURLToPath(import.meta.resolve('@playwright/test/cli'))

const terminateChild = (child, signal) => {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return

  try {
    if (process.platform !== 'win32') process.kill(-child.pid, signal)
    else child.kill(signal)
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
}

const runPlaywright = ({
  args,
  env,
  playwrightCli,
  signalSource,
  writeStderr,
  writeStdout,
}) =>
  new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [playwrightCli, 'test', ...args], {
      detached: process.platform !== 'win32',
      env,
      stdio: ['inherit', 'pipe', 'pipe'],
    })
    let combinedOutput = ''
    let forwardedSignal
    let forceKillTimer

    const tee = (writer) => (chunk) => {
      const text = chunk.toString()
      combinedOutput += text
      writer(text)
    }
    child.stdout.on('data', tee(writeStdout))
    child.stderr.on('data', tee(writeStderr))

    const onSignal = (signal) => {
      if (forwardedSignal) return
      forwardedSignal = signal
      terminateChild(child, signal)
      forceKillTimer = setTimeout(
        () => terminateChild(child, 'SIGKILL'),
        FORCE_KILL_TIMEOUT_MS,
      )
      forceKillTimer.unref()
    }
    const onSigint = () => onSignal('SIGINT')
    const onSigterm = () => onSignal('SIGTERM')
    signalSource.on('SIGINT', onSigint)
    signalSource.on('SIGTERM', onSigterm)

    const cleanup = () => {
      signalSource.off('SIGINT', onSigint)
      signalSource.off('SIGTERM', onSigterm)
      if (forceKillTimer) clearTimeout(forceKillTimer)
    }

    child.once('error', (error) => {
      cleanup()
      writeStderr(`[e2e] Unable to start Playwright: ${error.message}\n`)
      resolvePromise({ combinedOutput, exitCode: 1 })
    })
    child.once('close', (code, signal) => {
      cleanup()
      const exitCode =
        forwardedSignal !== undefined
          ? signalExitCodes[forwardedSignal]
          : (code ?? signalExitCodes[signal] ?? 1)
      resolvePromise({ combinedOutput, exitCode })
    })
  })

const bindFailure = (output, reservation) => {
  const markers = output.matchAll(/E2E_PORT_BIND_FAILED:(dev|pages):(\d+)/g)

  for (const [, role, portValue] of markers) {
    const selected = reservation[role]
    if (selected.source === 'dynamic' && selected.port === Number(portValue)) {
      return true
    }
  }

  for (const role of ['dev', 'pages']) {
    const selected = reservation[role]
    if (selected.source !== 'dynamic') continue

    const url = `http://${E2E_HOST}:${selected.port}`.replaceAll('.', '\\.')
    if (new RegExp(`${url}(?:/\\S*)? is already used`).test(output)) return true
  }

  return false
}

export const runE2E = async ({
  args = [],
  env = process.env,
  playwrightCli = defaultPlaywrightCli(),
  portDefaults,
  signalSource = process,
  writeStderr = (chunk) => process.stderr.write(chunk),
  writeStdout = (chunk) => process.stdout.write(chunk),
} = {}) => {
  const excludePorts = new Set()

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let reservation
    try {
      reservation = await reserveE2EPorts({
        defaults: portDefaults,
        env,
        excludePorts,
      })
    } catch (error) {
      writeStderr(`[e2e] ${error.message}\n`)
      return { attempts: attempt, exitCode: 1 }
    }

    writeStdout(
      `[e2e] attempt ${attempt}/${MAX_ATTEMPTS}: dev=${reservation.dev.port} (${reservation.dev.source}), pages=${reservation.pages.port} (${reservation.pages.source})\n`,
    )

    const childEnv = {
      ...env,
      E2E_DEV_PORT: String(reservation.dev.port),
      E2E_PAGES_PORT: String(reservation.pages.port),
    }
    await reservation.release()

    const result = await runPlaywright({
      args,
      env: childEnv,
      playwrightCli,
      signalSource,
      writeStderr,
      writeStdout,
    })
    const canRetry =
      attempt < MAX_ATTEMPTS && bindFailure(result.combinedOutput, reservation)

    if (!canRetry) {
      return { attempts: attempt, exitCode: result.exitCode }
    }

    for (const role of ['dev', 'pages']) {
      if (reservation[role].source === 'dynamic') {
        excludePorts.add(reservation[role].port)
      }
    }
    writeStderr(
      '[e2e] Dynamic port bind collision detected; retrying with a fresh allocation.\n',
    )
  }
}

const isMain =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const result = await runE2E({ args: process.argv.slice(2) })
  process.exitCode = result.exitCode
}
