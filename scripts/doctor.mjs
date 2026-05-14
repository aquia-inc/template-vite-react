#!/usr/bin/env node
import process from 'node:process'

import {
  checkRuntime,
  detectAuthProfile,
  ENV_LOCAL_FILE,
  printRuntimeErrors,
  readLocalEnv,
  REQUIRED_NODE_MAJOR,
  REQUIRED_YARN_VERSION,
  writer,
} from './setup-doctor-core.mjs'

export { detectAuthProfile } from './setup-doctor-core.mjs'

export const runDoctor = async ({
  cwd = process.cwd(),
  env = process.env,
  nodeVersion = process.versions.node,
  stdout = writer(process.stdout),
  stderr = writer(process.stderr),
  runCommand,
} = {}) => {
  const runtime = checkRuntime({ cwd, env, nodeVersion, runCommand })
  const localEnv = await readLocalEnv(cwd)
  const envPresent = localEnv !== null
  const authProfile = envPresent ? detectAuthProfile(localEnv) : 'unavailable'

  stdout.write(
    `Node: ${runtime.nodeVersion} (${
      runtime.nodeOk ? 'ok' : `expected ${REQUIRED_NODE_MAJOR}`
    })`,
  )
  stdout.write(
    `Yarn: ${runtime.yarnVersion ?? 'not found'} (${
      runtime.yarnOk ? 'ok' : `expected ${REQUIRED_YARN_VERSION}`
    })`,
  )
  stdout.write(
    `env file: ${envPresent ? `present (${ENV_LOCAL_FILE})` : 'missing (warning)'}`,
  )
  stdout.write(`auth profile: ${authProfile}`)

  if (!runtime.ok) {
    printRuntimeErrors(runtime, stderr)
  }

  if (!envPresent) {
    stderr.write(
      `Warning: ${ENV_LOCAL_FILE} is missing. Run \`yarn setup\` to create it from .env.example.`,
    )
  }

  return runtime.ok ? 0 : 1
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await runDoctor()
}
