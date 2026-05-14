#!/usr/bin/env node
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import {
  commandRunner,
  ensureLocalEnv,
  printRuntimeErrors,
  checkRuntime,
  ENV_LOCAL_FILE,
  writer,
} from './setup-doctor-core.mjs'

export const runSetup = async ({
  cwd = process.cwd(),
  env = process.env,
  nodeVersion = process.versions.node,
  runCommand = commandRunner,
  stdout = writer(process.stdout),
  stderr = writer(process.stderr),
} = {}) => {
  const runtime = checkRuntime({ cwd, env, nodeVersion, runCommand })

  if (!runtime.ok) {
    printRuntimeErrors(runtime, stderr)
    return 1
  }

  try {
    const envStatus = await ensureLocalEnv(cwd)

    if (envStatus === 'created') {
      stdout.write(`Created ${ENV_LOCAL_FILE} from .env.example.`)
    } else {
      stdout.write(`${ENV_LOCAL_FILE} already exists; leaving it unchanged.`)
    }
  } catch (error) {
    stderr.write(
      `Error: could not prepare ${ENV_LOCAL_FILE}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return 1
  }

  const prepare = runCommand('yarn', ['prepare'], { cwd })

  if (prepare.status !== 0) {
    stderr.write(
      'Warning: Husky setup could not run with `yarn prepare`. Runtime checks passed, so setup will continue.',
    )

    if (prepare.stderr) {
      stderr.write(prepare.stderr.trim())
    }

    return 0
  }

  stdout.write('Husky hooks prepared with `yarn prepare`.')
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await runSetup()
}
