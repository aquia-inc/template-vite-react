import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'

const execFileAsync = promisify(execFile)

const requiredUserAgent = 'yarn/4.14.1 npm/? node/v24.15.0 darwin arm64'

const makeEntrypointFixture = async () => {
  const cwd = await mkdtemp(
    path.join(await realpath(tmpdir()), 'template vite react-'),
  )
  const scriptsDir = path.join(cwd, 'scripts')

  await mkdir(scriptsDir)
  await copyFile('scripts/setup.mjs', path.join(scriptsDir, 'setup.mjs'))
  await copyFile(
    'scripts/setup-doctor-core.mjs',
    path.join(scriptsDir, 'setup-doctor-core.mjs'),
  )
  await writeFile(
    path.join(cwd, '.env.example'),
    "VITE_DEMO_AUTH_ENABLED='false'\nVITE_IDP_ENABLED='false'\n",
  )

  return cwd
}

test('setup CLI entrypoint runs from paths containing spaces', async () => {
  const cwd = await makeEntrypointFixture()
  const envPath = path.join(cwd, '.env.development.local')

  try {
    await execFileAsync(
      process.execPath,
      [path.join(cwd, 'scripts/setup.mjs')],
      {
        cwd,
        env: {
          ...process.env,
          npm_config_user_agent: requiredUserAgent,
        },
      },
    )

    assert.equal(
      await readFile(envPath, 'utf8'),
      "VITE_DEMO_AUTH_ENABLED='false'\nVITE_IDP_ENABLED='false'\n",
    )

    await writeFile(envPath, 'LOCAL_ONLY=true\n')
    await execFileAsync(
      process.execPath,
      [path.join(cwd, 'scripts/setup.mjs')],
      {
        cwd,
        env: {
          ...process.env,
          npm_config_user_agent: requiredUserAgent,
        },
      },
    )

    assert.equal(await readFile(envPath, 'utf8'), 'LOCAL_ONLY=true\n')
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})
