import type { AppConfig } from '@/types'
import { isCognitoConfigValid } from '@/utils/cognitoConfig'

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

const areCognitoConfigValuesBlank = (authConfig: {
  AWS_REGION: string
  COGNITO_DOMAIN: string
  COGNITO_REDIRECT_SIGN_IN: string
  COGNITO_REDIRECT_SIGN_OUT: string
  USER_POOL_CLIENT_ID: string
  USER_POOL_ID: string
}) => Object.values(authConfig).every((value) => value.trim() === '')

export const createAppConfig = (env: AppConfigEnv): AppConfig => {
  const cfDomain = env.VITE_CF_DOMAIN ?? ''
  const authConfig = {
    AWS_REGION: env.VITE_AWS_REGION ?? '',
    COGNITO_DOMAIN: env.VITE_COGNITO_DOMAIN ?? '',
    COGNITO_REDIRECT_SIGN_IN: env.VITE_COGNITO_REDIRECT_SIGN_IN ?? '',
    COGNITO_REDIRECT_SIGN_OUT: env.VITE_COGNITO_REDIRECT_SIGN_OUT ?? '',
    USER_POOL_CLIENT_ID: env.VITE_USER_POOL_CLIENT_ID ?? '',
    USER_POOL_ID: env.VITE_USER_POOL_ID ?? '',
  }
  const cognitoAuthEnabled = isCognitoConfigValid(authConfig)
  const demoAuthEnabled =
    !cognitoAuthEnabled &&
    areCognitoConfigValuesBlank(authConfig) &&
    readBooleanEnv(env.VITE_DEMO_AUTH_ENABLED)

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
    AUTH_ENABLED: cognitoAuthEnabled || demoAuthEnabled,
    COGNITO_AUTH_ENABLED: cognitoAuthEnabled,
    DEMO_AUTH_ENABLED: demoAuthEnabled,
    IDP_ENABLED: readBooleanEnv(env.VITE_IDP_ENABLED),
  }
}
