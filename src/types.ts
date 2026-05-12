/**
 * Type definitions for the application.
 * @module types
 */
export type AppConfig = {
  AWS_REGION: string | 'us-east-1'
  API_URL: string
  CF_DOMAIN: string
  PUBLIC_BASE_PATH: string
  COGNITO_DOMAIN: string
  COGNITO_REDIRECT_SIGN_IN: string
  COGNITO_REDIRECT_SIGN_OUT: string
  USER_POOL_CLIENT_ID: string
  USER_POOL_ID: string
} & AppFeatureFlags

export type AppFeatureFlags = {
  AUTH_ENABLED: boolean
  IDP_ENABLED: boolean
}

export type FormField = {
  name: string
  label?: string
  type: string
  required?: boolean
  disabled?: boolean
  multiline?: boolean
  value?: string | number | boolean | null
  component: React.ElementType
}

export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'

export type ThemeSkin = 'filled' | 'light' | 'light-static'
