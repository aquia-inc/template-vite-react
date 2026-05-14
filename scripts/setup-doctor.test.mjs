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

const validRuntimeEnv = {
  npm_config_user_agent: 'yarn/4.14.1 npm/? node/v24.15.0 darwin arm64',
}

const blankCognitoEnv = {
  VITE_AWS_REGION: 'us-east-1',
  VITE_COGNITO_DOMAIN: '',
  VITE_COGNITO_REDIRECT_SIGN_IN: '',
  VITE_COGNITO_REDIRECT_SIGN_OUT: '',
  VITE_USER_POOL_CLIENT_ID: '',
  VITE_USER_POOL_ID: '',
}

const validCognitoEnv = {
  VITE_AWS_REGION: 'us-east-1',
  VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
  VITE_COGNITO_REDIRECT_SIGN_IN: 'http://localhost:3000/signin',
  VITE_COGNITO_REDIRECT_SIGN_OUT: 'http://localhost:3000/signout',
  VITE_USER_POOL_CLIENT_ID: 'client-id',
  VITE_USER_POOL_ID: 'us-east-1_abcd1234',
}

test('runSetup creates the development env file when it is missing', async () => {
  const cwd = await makeFixture()
  const out = makeRecorder()
  const commands = []

  try {
    const exitCode = await runSetup({
      cwd,
      env: validRuntimeEnv,
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
      env: validRuntimeEnv,
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
      env: validRuntimeEnv,
      nodeVersion: '24.15.0',
      stdout: out,
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 0)
    assert.match(out.messages.join('\n'), /Node: 24\.15\.0/)
    assert.match(out.messages.join('\n'), /Yarn: 4\.14\.1/)
    assert.match(out.messages.join('\n'), /env sources: missing/)
    assert.match(out.messages.join('\n'), /auth profile: local-disabled/)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('runDoctor merges Vite env files in development priority order', async () => {
  const cwd = await makeFixture()
  const out = makeRecorder()

  await writeFile(path.join(cwd, '.env'), "VITE_DEMO_AUTH_ENABLED='false'\n")
  await writeFile(
    path.join(cwd, '.env.local'),
    "VITE_DEMO_AUTH_ENABLED='true'\nVITE_PUBLIC_BASE_PATH='/template-vite-react/'\n",
  )
  await writeFile(
    path.join(cwd, '.env.development'),
    "VITE_PUBLIC_BASE_PATH='/'\n",
  )
  await writeFile(
    path.join(cwd, '.env.development.local'),
    "VITE_DEMO_AUTH_ENABLED='true'\n",
  )

  try {
    const exitCode = await runDoctor({
      cwd,
      env: validRuntimeEnv,
      nodeVersion: '24.15.0',
      stdout: out,
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 0)
    assert.match(
      out.messages.join('\n'),
      /env sources: \.env, \.env\.local, \.env\.development, \.env\.development\.local/,
    )
    assert.match(out.messages.join('\n'), /auth profile: local-demo/)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('runDoctor lets .env.development alone affect auth profile detection', async () => {
  const cwd = await makeFixture()
  const out = makeRecorder()

  await writeFile(
    path.join(cwd, '.env.development'),
    "VITE_DEMO_AUTH_ENABLED='true'\nVITE_PUBLIC_BASE_PATH='/template-vite-react/'\n",
  )

  try {
    const exitCode = await runDoctor({
      cwd,
      env: validRuntimeEnv,
      nodeVersion: '24.15.0',
      stdout: out,
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 0)
    assert.match(out.messages.join('\n'), /env sources: \.env\.development/)
    assert.match(out.messages.join('\n'), /auth profile: pages-demo/)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('runDoctor lets process env override Vite env files', async () => {
  const cwd = await makeFixture()
  const out = makeRecorder()

  await writeFile(
    path.join(cwd, '.env.development.local'),
    "VITE_DEMO_AUTH_ENABLED='false'\nVITE_PUBLIC_BASE_PATH='/template-vite-react/'\n",
  )

  try {
    const exitCode = await runDoctor({
      cwd,
      env: {
        ...validRuntimeEnv,
        VITE_DEMO_AUTH_ENABLED: 'true',
        VITE_PUBLIC_BASE_PATH: '/',
      },
      nodeVersion: '24.15.0',
      stdout: out,
      stderr: makeRecorder(),
    })

    assert.equal(exitCode, 0)
    assert.match(
      out.messages.join('\n'),
      /env sources: \.env\.development\.local, process env/,
    )
    assert.match(out.messages.join('\n'), /auth profile: local-demo/)
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

test('detectAuthProfile matches representative appConfig runtime profiles', () => {
  const profileCases = [
    {
      name: 'local-disabled',
      env: {
        ...blankCognitoEnv,
        VITE_DEMO_AUTH_ENABLED: 'false',
        VITE_PUBLIC_BASE_PATH: '/',
      },
      profile: 'local-disabled',
    },
    {
      name: 'local-demo',
      env: {
        ...blankCognitoEnv,
        VITE_DEMO_AUTH_ENABLED: 'true',
        VITE_PUBLIC_BASE_PATH: '/',
      },
      profile: 'local-demo',
    },
    {
      name: 'pages-demo',
      env: {
        ...blankCognitoEnv,
        VITE_DEMO_AUTH_ENABLED: 'true',
        VITE_PUBLIC_BASE_PATH: '/template-vite-react/',
      },
      profile: 'pages-demo',
    },
    {
      name: 'cognito',
      env: {
        ...validCognitoEnv,
        VITE_DEMO_AUTH_ENABLED: 'false',
      },
      profile: 'cognito',
    },
    {
      name: 'cognito overrides requested demo auth',
      env: {
        ...validCognitoEnv,
        VITE_DEMO_AUTH_ENABLED: 'true',
      },
      profile: 'cognito',
    },
    {
      name: 'unknown',
      env: {
        ...blankCognitoEnv,
        VITE_DEMO_AUTH_ENABLED: 'true',
        VITE_PUBLIC_BASE_PATH: '/',
        VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
      },
      profile: 'unknown',
    },
  ]

  for (const { name, env, profile } of profileCases) {
    assert.equal(detectAuthProfile(env), profile, name)
  }
})
