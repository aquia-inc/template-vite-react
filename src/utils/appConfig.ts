import type { AppConfig } from '@/types'

type AppConfigEnv = {
  VITE_AWS_REGION?: string
  VITE_CF_DOMAIN?: string
  VITE_COGNITO_DOMAIN?: string
  VITE_COGNITO_REDIRECT_SIGN_IN?: string
  VITE_COGNITO_REDIRECT_SIGN_OUT?: string
  VITE_IDP_ENABLED?: string
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

export const createAppConfig = (env: AppConfigEnv): AppConfig => {
  const cfDomain = env.VITE_CF_DOMAIN ?? ''

  return {
    //* AWS configuration
    AWS_REGION: env.VITE_AWS_REGION ?? '',
    CF_DOMAIN: cfDomain,
    API_URL: buildApiUrl(cfDomain),
    COGNITO_DOMAIN: env.VITE_COGNITO_DOMAIN ?? '',
    COGNITO_REDIRECT_SIGN_IN: env.VITE_COGNITO_REDIRECT_SIGN_IN ?? '',
    COGNITO_REDIRECT_SIGN_OUT: env.VITE_COGNITO_REDIRECT_SIGN_OUT ?? '',
    USER_POOL_CLIENT_ID: env.VITE_USER_POOL_CLIENT_ID ?? '',
    USER_POOL_ID: env.VITE_USER_POOL_ID ?? '',

    //* Feature flags
    IDP_ENABLED: readBooleanEnv(env.VITE_IDP_ENABLED),
  }
}
