#!/usr/bin/env node
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import {
  checkRuntime,
  detectAuthProfile,
  printRuntimeErrors,
  readViteEnv,
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
  const viteEnv = await readViteEnv({ cwd, env })
  const envPresent = viteEnv.envFiles.length > 0 || viteEnv.hasProcessEnv
  const envSources = [
    ...viteEnv.envFiles,
    ...(viteEnv.hasProcessEnv ? ['process env'] : []),
  ]
  const authProfile = detectAuthProfile(viteEnv.values)

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
    `env sources: ${envPresent ? envSources.join(', ') : 'missing (warning)'}`,
  )
  stdout.write(`auth profile: ${authProfile}`)

  if (!runtime.ok) {
    printRuntimeErrors(runtime, stderr)
  }

  if (!envPresent) {
    stderr.write(
      'Warning: no Vite env sources found. Run `yarn setup` to create .env.development.local from .env.example.',
    )
  }

  return runtime.ok ? 0 : 1
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = await runDoctor()
}
