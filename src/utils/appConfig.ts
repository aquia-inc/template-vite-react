import type { AppConfig, AppConfigProfileResult } from '@/types'
import {
  getCognitoConfigError,
  isCognitoConfigValid,
} from '@/utils/cognitoConfig'

type AppConfigEnv = {
  VITE_AWS_REGION?: string
  VITE_CF_DOMAIN?: string
  VITE_COGNITO_DOMAIN?: string
  VITE_COGNITO_REDIRECT_SIGN_IN?: string
  VITE_COGNITO_REDIRECT_SIGN_OUT?: string
  VITE_DEMO_AUTH_ENABLED?: string
  VITE_IDP_ENABLED?: string
  VITE_PUBLIC_BASE_PATH?: string
  VITE_USER_POOL_CLIENT_ID?: string
  VITE_USER_POOL_ID?: string
}

type AuthConfig = {
  AWS_REGION: string
  COGNITO_DOMAIN: string
  COGNITO_REDIRECT_SIGN_IN: string
  COGNITO_REDIRECT_SIGN_OUT: string
  USER_POOL_CLIENT_ID: string
  USER_POOL_ID: string
}

export const readBooleanEnv = (value: string | undefined) => value === 'true'

export const buildApiUrl = (cfDomain: string) => {
  if (!cfDomain) {
    return '/api'
  }

  try {
    return new URL('/api', cfDomain).toString()
  } catch {
    return `${cfDomain.replace(/\/+$/, '')}/api`
  }
}

const getCognitoSpecificValues = (authConfig: AuthConfig) => [
  authConfig.COGNITO_DOMAIN,
  authConfig.COGNITO_REDIRECT_SIGN_IN,
  authConfig.COGNITO_REDIRECT_SIGN_OUT,
  authConfig.USER_POOL_CLIENT_ID,
  authConfig.USER_POOL_ID,
]

const areCognitoSpecificValuesBlank = (authConfig: AuthConfig) =>
  getCognitoSpecificValues(authConfig).every((value) => value.trim() === '')

const areCognitoConfigValuesPartiallySet = (authConfig: AuthConfig) =>
  !areCognitoSpecificValuesBlank(authConfig) &&
  !isCognitoConfigValid(authConfig)

const isAppConfig = (
  configOrEnv: AppConfigEnv | AppConfig,
): configOrEnv is AppConfig => 'AUTH_ENABLED' in configOrEnv

const getAuthConfig = (configOrEnv: AppConfigEnv | AppConfig): AuthConfig => ({
  AWS_REGION: isAppConfig(configOrEnv)
    ? configOrEnv.AWS_REGION
    : (configOrEnv.VITE_AWS_REGION ?? ''),
  COGNITO_DOMAIN: isAppConfig(configOrEnv)
    ? configOrEnv.COGNITO_DOMAIN
    : (configOrEnv.VITE_COGNITO_DOMAIN ?? ''),
  COGNITO_REDIRECT_SIGN_IN: isAppConfig(configOrEnv)
    ? configOrEnv.COGNITO_REDIRECT_SIGN_IN
    : (configOrEnv.VITE_COGNITO_REDIRECT_SIGN_IN ?? ''),
  COGNITO_REDIRECT_SIGN_OUT: isAppConfig(configOrEnv)
    ? configOrEnv.COGNITO_REDIRECT_SIGN_OUT
    : (configOrEnv.VITE_COGNITO_REDIRECT_SIGN_OUT ?? ''),
  USER_POOL_CLIENT_ID: isAppConfig(configOrEnv)
    ? configOrEnv.USER_POOL_CLIENT_ID
    : (configOrEnv.VITE_USER_POOL_CLIENT_ID ?? ''),
  USER_POOL_ID: isAppConfig(configOrEnv)
    ? configOrEnv.USER_POOL_ID
    : (configOrEnv.VITE_USER_POOL_ID ?? ''),
})

const getPublicBasePath = (configOrEnv: AppConfigEnv | AppConfig) =>
  isAppConfig(configOrEnv)
    ? configOrEnv.PUBLIC_BASE_PATH
    : (configOrEnv.VITE_PUBLIC_BASE_PATH ?? '/')

const getDemoAuthEnv = (configOrEnv: AppConfigEnv | AppConfig) =>
  isAppConfig(configOrEnv)
    ? String(configOrEnv.DEMO_AUTH_ENABLED)
    : configOrEnv.VITE_DEMO_AUTH_ENABLED

export const getAppConfigProfile = (
  configOrEnv: AppConfigEnv | AppConfig,
): AppConfigProfileResult => {
  const authConfig = getAuthConfig(configOrEnv)
  const publicBasePath = getPublicBasePath(configOrEnv)
  const demoAuthRequested = readBooleanEnv(getDemoAuthEnv(configOrEnv))
  const cognitoAuthEnabled = isCognitoConfigValid(authConfig)
  const cognitoValuesBlank = areCognitoSpecificValuesBlank(authConfig)
  const demoAuthEnabled =
    !cognitoAuthEnabled && cognitoValuesBlank && demoAuthRequested
  const warnings: string[] = []

  if (demoAuthRequested && cognitoAuthEnabled) {
    warnings.push(
      'Demo auth was requested but valid Cognito config is present. Cognito auth takes precedence.',
    )
  }

  if (demoAuthRequested && areCognitoConfigValuesPartiallySet(authConfig)) {
    warnings.push(
      'Demo auth was requested but Cognito environment values are partially configured. Leave all Cognito values blank for demo auth.',
    )
  }

  const cognitoConfigError = getCognitoConfigError(authConfig)
  if (!cognitoValuesBlank && !cognitoAuthEnabled && cognitoConfigError) {
    warnings.push(
      `Cognito environment values are partially configured but invalid: ${cognitoConfigError}`,
    )
  }

  if (cognitoAuthEnabled) {
    return {
      profile: 'cognito',
      authEnabled: true,
      cognitoAuthEnabled,
      demoAuthEnabled,
      warnings,
    }
  }

  if (demoAuthEnabled) {
    return {
      profile: publicBasePath === '/' ? 'local-demo' : 'pages-demo',
      authEnabled: true,
      cognitoAuthEnabled,
      demoAuthEnabled,
      warnings,
    }
  }

  if (cognitoValuesBlank) {
    return {
      profile: 'local-disabled',
      authEnabled: false,
      cognitoAuthEnabled,
      demoAuthEnabled,
      warnings,
    }
  }

  return {
    profile: 'unknown',
    authEnabled: false,
    cognitoAuthEnabled,
    demoAuthEnabled,
    warnings,
  }
}

export const createAppConfig = (env: AppConfigEnv): AppConfig => {
  const cfDomain = env.VITE_CF_DOMAIN ?? ''
  const authConfig = getAuthConfig(env)
  const profile = getAppConfigProfile(env)

  return {
    //* AWS configuration
    AWS_REGION: authConfig.AWS_REGION,
    CF_DOMAIN: cfDomain,
    API_URL: buildApiUrl(cfDomain),
    PUBLIC_BASE_PATH: env.VITE_PUBLIC_BASE_PATH ?? '/',
    COGNITO_DOMAIN: authConfig.COGNITO_DOMAIN,
    COGNITO_REDIRECT_SIGN_IN: authConfig.COGNITO_REDIRECT_SIGN_IN,
    COGNITO_REDIRECT_SIGN_OUT: authConfig.COGNITO_REDIRECT_SIGN_OUT,
    USER_POOL_CLIENT_ID: authConfig.USER_POOL_CLIENT_ID,
    USER_POOL_ID: authConfig.USER_POOL_ID,

    //* Feature flags
    AUTH_ENABLED: profile.authEnabled,
    COGNITO_AUTH_ENABLED: profile.cognitoAuthEnabled,
    DEMO_AUTH_ENABLED: profile.demoAuthEnabled,
    IDP_ENABLED: readBooleanEnv(env.VITE_IDP_ENABLED),
  }
}
