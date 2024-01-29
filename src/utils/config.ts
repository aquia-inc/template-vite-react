/**
 * Set global configuration for the application provided by Vite environment variables
 * @module utils/config
 * @exports CONFIG
 */
import type { AppConfig } from '@/types'

const CONFIG = {
  //* AWS configuration
  AWS_REGION: `${import.meta.env.VITE_AWS_REGION}`,
  CF_DOMAIN: `${import.meta.env.VITE_CF_DOMAIN}`,
  API_URL: `${import.meta.env.VITE_CF_DOMAIN}/api`,
  COGNITO_DOMAIN: `${import.meta.env.VITE_COGNITO_DOMAIN}`,
  COGNITO_REDIRECT_SIGN_IN: `${import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN}`,
  COGNITO_REDIRECT_SIGN_OUT: `${
    import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT
  }`,
  USER_POOL_CLIENT_ID: `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`,
  USER_POOL_ID: `${import.meta.env.VITE_USER_POOL_ID}`,

  //* Feature flags
  IDP_ENABLED: Boolean(import.meta.env.VITE_IDP_ENABLED),
} satisfies AppConfig

export default CONFIG
