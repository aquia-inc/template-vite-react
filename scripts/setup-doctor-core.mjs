import { spawnSync } from 'node:child_process'
import { access, copyFile, readFile } from 'node:fs/promises'
import path from 'node:path'

export const REQUIRED_NODE_MAJOR = 24
export const REQUIRED_YARN_VERSION = '4.14.1'
export const ENV_EXAMPLE_FILE = '.env.example'
export const ENV_LOCAL_FILE = '.env.development.local'
export const VITE_ENV_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  ENV_LOCAL_FILE,
]

export const commandRunner = (command, args, options = {}) =>
  spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    shell: false,
    stdio: options.stdio ?? 'pipe',
  })

export const writer = (stream) => ({
  write: (message) => stream.write(`${message}\n`),
})

export const fileExists = async (filePath) => {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const parseYarnVersionFromUserAgent = (userAgent = '') => {
  const match = userAgent.match(/(?:^|\s)yarn\/([^\s]+)/)
  return match?.[1] ?? null
}

export const getYarnVersion = ({ cwd, env, runCommand = commandRunner }) => {
  const userAgentVersion = parseYarnVersionFromUserAgent(
    env.npm_config_user_agent,
  )

  if (userAgentVersion) {
    return userAgentVersion
  }

  const result = runCommand('yarn', ['-v'], { cwd })

  if (result.status === 0 && result.stdout) {
    return result.stdout.trim()
  }

  return null
}

export const checkRuntime = ({
  cwd,
  env = process.env,
  nodeVersion = process.versions.node,
  runCommand = commandRunner,
} = {}) => {
  const nodeMajor = Number.parseInt(nodeVersion.split('.')[0] ?? '', 10)
  const yarnVersion = getYarnVersion({ cwd, env, runCommand })
  const errors = []

  if (nodeMajor !== REQUIRED_NODE_MAJOR) {
    errors.push(
      `Node ${REQUIRED_NODE_MAJOR} is required; detected ${nodeVersion}.`,
    )
  }

  if (yarnVersion !== REQUIRED_YARN_VERSION) {
    errors.push(
      `Yarn ${REQUIRED_YARN_VERSION} is required; detected ${
        yarnVersion ?? 'not found'
      }.`,
    )
  }

  return {
    errors,
    nodeOk: nodeMajor === REQUIRED_NODE_MAJOR,
    nodeVersion,
    yarnOk: yarnVersion === REQUIRED_YARN_VERSION,
    yarnVersion,
    ok: errors.length === 0,
  }
}

export const parseEnvFile = (content) => {
  const values = {}

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const delimiterIndex = line.indexOf('=')

    if (delimiterIndex === -1) {
      continue
    }

    const key = line
      .slice(0, delimiterIndex)
      .trim()
      .replace(/^export\s+/, '')
    let value = line.slice(delimiterIndex + 1).trim()

    if (!key) {
      continue
    }

    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }

    values[key] = value
  }

  return values
}

const getProcessViteEnv = (env = {}) =>
  Object.fromEntries(
    Object.entries(env).filter(
      ([key, value]) => key.startsWith('VITE_') && value !== undefined,
    ),
  )

const isUrl = (value = '') => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const hasValue = (value = '') => value.trim().length > 0

const isValidUserPoolId = (value = '') =>
  /^[a-z0-9-]+_[A-Za-z0-9]+$/.test(value)

const getCognitoSpecificValues = (authConfig) => [
  authConfig.COGNITO_DOMAIN,
  authConfig.COGNITO_REDIRECT_SIGN_IN,
  authConfig.COGNITO_REDIRECT_SIGN_OUT,
  authConfig.USER_POOL_CLIENT_ID,
  authConfig.USER_POOL_ID,
]

export const detectAuthProfile = (env) => {
  const authConfig = {
    AWS_REGION: env.VITE_AWS_REGION ?? '',
    COGNITO_DOMAIN: env.VITE_COGNITO_DOMAIN ?? '',
    COGNITO_REDIRECT_SIGN_IN: env.VITE_COGNITO_REDIRECT_SIGN_IN ?? '',
    COGNITO_REDIRECT_SIGN_OUT: env.VITE_COGNITO_REDIRECT_SIGN_OUT ?? '',
    USER_POOL_CLIENT_ID: env.VITE_USER_POOL_CLIENT_ID ?? '',
    USER_POOL_ID: env.VITE_USER_POOL_ID ?? '',
  }
  const cognitoSpecificValues = getCognitoSpecificValues(authConfig)
  const cognitoSpecificValuesBlank = cognitoSpecificValues.every(
    (value) => value.trim() === '',
  )
  const anyCognitoSpecificValuePresent = cognitoSpecificValues.some(hasValue)
  const cognitoValid =
    hasValue(authConfig.AWS_REGION) &&
    isValidUserPoolId(authConfig.USER_POOL_ID) &&
    hasValue(authConfig.USER_POOL_CLIENT_ID) &&
    isUrl(authConfig.COGNITO_DOMAIN) &&
    isUrl(authConfig.COGNITO_REDIRECT_SIGN_IN) &&
    isUrl(authConfig.COGNITO_REDIRECT_SIGN_OUT)

  if (cognitoValid) {
    return 'cognito'
  }

  if (cognitoSpecificValuesBlank && env.VITE_DEMO_AUTH_ENABLED === 'true') {
    return env.VITE_PUBLIC_BASE_PATH && env.VITE_PUBLIC_BASE_PATH !== '/'
      ? 'pages-demo'
      : 'local-demo'
  }

  if (anyCognitoSpecificValuePresent) {
    return 'unknown'
  }

  return 'local-disabled'
}

export const readLocalEnv = async (cwd) => {
  const envPath = path.join(cwd, ENV_LOCAL_FILE)

  if (!(await fileExists(envPath))) {
    return null
  }

  return parseEnvFile(await readFile(envPath, 'utf8'))
}

export const readViteEnv = async ({ cwd, env = process.env } = {}) => {
  const values = {}
  const envFiles = []

  for (const envFile of VITE_ENV_FILES) {
    const envPath = path.join(cwd, envFile)

    if (!(await fileExists(envPath))) {
      continue
    }

    Object.assign(values, parseEnvFile(await readFile(envPath, 'utf8')))
    envFiles.push(envFile)
  }

  const processEnv = getProcessViteEnv(env)

  return {
    envFiles,
    hasProcessEnv: Object.keys(processEnv).length > 0,
    values: {
      ...values,
      ...processEnv,
    },
  }
}

export const ensureLocalEnv = async (cwd) => {
  const sourcePath = path.join(cwd, ENV_EXAMPLE_FILE)
  const targetPath = path.join(cwd, ENV_LOCAL_FILE)

  if (await fileExists(targetPath)) {
    return 'existing'
  }

  await copyFile(sourcePath, targetPath)
  return 'created'
}

export const printRuntimeErrors = (runtime, stderr) => {
  for (const error of runtime.errors) {
    stderr.write(`Error: ${error}`)
  }
}
