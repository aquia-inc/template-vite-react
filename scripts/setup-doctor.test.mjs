import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { detectAuthProfile, runDoctor } from './doctor.mjs'
import { runSetup } from './setup.mjs'

const makeFixture = async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'template-vite-react-'))
  await writeFile(
    path.join(cwd, '.env.example'),
    "VITE_DEMO_AUTH_ENABLED='false'\nVITE_IDP_ENABLED='false'\n",
  )

  return cwd
}

const makeRecorder = () => {
  const messages = []

  return {
    messages,
    write: (message) => messages.push(message),
  }
}

test('runSetup creates the development env file when it is missing', async () => {
  const cwd = await makeFixture()
  const out = makeRecorder()
  const commands = []

  try {
    const exitCode = await runSetup({
      cwd,
      env: {
        npm_config_user_agent: 'yarn/4.14.1 npm/? node/v24.15.0 darwin arm64',
      },
      nodeVersion: '24.15.0',
      runCommand: (command, args) => {
        commands.push([command, args])
        return { status: 0 }
      },
      stdout: out,
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 0)
    assert.equal(
      await readFile(path.join(cwd, '.env.development.local'), 'utf8'),
      "VITE_DEMO_AUTH_ENABLED='false'\nVITE_IDP_ENABLED='false'\n",
    )
    assert.deepEqual(commands, [['yarn', ['prepare']]])
    assert.match(out.messages.join('\n'), /created/i)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('runSetup preserves an existing development env file', async () => {
  const cwd = await makeFixture()
  const out = makeRecorder()
  await writeFile(path.join(cwd, '.env.development.local'), 'LOCAL_ONLY=true\n')

  try {
    const exitCode = await runSetup({
      cwd,
      env: {
        npm_config_user_agent: 'yarn/4.14.1 npm/? node/v24.15.0 darwin arm64',
      },
      nodeVersion: '24.15.0',
      runCommand: () => ({ status: 0 }),
      stdout: out,
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 0)
    assert.equal(
      await readFile(path.join(cwd, '.env.development.local'), 'utf8'),
      'LOCAL_ONLY=true\n',
    )
    assert.match(out.messages.join('\n'), /already exists/i)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('runSetup fails on runtime version mismatches before preparing hooks', async () => {
  const cwd = await makeFixture()
  const commands = []

  try {
    const exitCode = await runSetup({
      cwd,
      env: {
        npm_config_user_agent: 'yarn/4.13.0 npm/? node/v23.0.0 darwin arm64',
      },
      nodeVersion: '23.0.0',
      runCommand: (command, args) => {
        commands.push([command, args])
        return { status: 0 }
      },
      stdout: makeRecorder(),
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 1)
    assert.deepEqual(commands, [])
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('runDoctor warns for a missing env file but succeeds with valid runtime', async () => {
  const cwd = await makeFixture()
  const out = makeRecorder()

  try {
    const exitCode = await runDoctor({
      cwd,
      env: {
        npm_config_user_agent: 'yarn/4.14.1 npm/? node/v24.15.0 darwin arm64',
      },
      nodeVersion: '24.15.0',
      stdout: out,
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 0)
    assert.match(out.messages.join('\n'), /Node: 24\.15\.0/)
    assert.match(out.messages.join('\n'), /Yarn: 4\.14\.1/)
    assert.match(out.messages.join('\n'), /env file: missing/)
    assert.match(out.messages.join('\n'), /auth profile: unavailable/)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('runDoctor fails for a wrong Yarn version', async () => {
  const cwd = await makeFixture()

  try {
    const exitCode = await runDoctor({
      cwd,
      env: {
        npm_config_user_agent: 'yarn/4.13.0 npm/? node/v24.15.0 darwin arm64',
      },
      nodeVersion: '24.15.0',
      stdout: makeRecorder(),
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 1)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('detectAuthProfile uses the app environment profile names', () => {
  assert.equal(
    detectAuthProfile({
      VITE_DEMO_AUTH_ENABLED: 'false',
      VITE_PUBLIC_BASE_PATH: '/',
      VITE_AWS_REGION: 'us-east-1',
      VITE_COGNITO_DOMAIN: '',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
    'local-disabled',
  )
  assert.equal(
    detectAuthProfile({
      VITE_DEMO_AUTH_ENABLED: 'true',
      VITE_PUBLIC_BASE_PATH: '/',
      VITE_AWS_REGION: 'us-east-1',
      VITE_COGNITO_DOMAIN: '',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
    'local-demo',
  )
  assert.equal(
    detectAuthProfile({
      VITE_DEMO_AUTH_ENABLED: 'true',
      VITE_PUBLIC_BASE_PATH: '/template-vite-react/',
      VITE_AWS_REGION: 'us-east-1',
      VITE_COGNITO_DOMAIN: '',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
    'pages-demo',
  )
  assert.equal(
    detectAuthProfile({
      VITE_DEMO_AUTH_ENABLED: 'false',
      VITE_AWS_REGION: 'us-east-1',
      VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
      VITE_COGNITO_REDIRECT_SIGN_IN: 'http://localhost:3000/signin',
      VITE_COGNITO_REDIRECT_SIGN_OUT: 'http://localhost:3000/signout',
      VITE_USER_POOL_CLIENT_ID: 'client-id',
      VITE_USER_POOL_ID: 'us-east-1_abcd1234',
    }),
    'cognito',
  )
  assert.equal(
    detectAuthProfile({
      VITE_DEMO_AUTH_ENABLED: 'true',
      VITE_PUBLIC_BASE_PATH: '/',
      VITE_AWS_REGION: 'us-east-1',
      VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
    'unknown',
  )
})
