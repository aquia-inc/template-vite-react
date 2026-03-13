import type { AppConfig } from '@/types'

type CognitoConfig = Pick<
  AppConfig,
  | 'AWS_REGION'
  | 'COGNITO_DOMAIN'
  | 'COGNITO_REDIRECT_SIGN_IN'
  | 'COGNITO_REDIRECT_SIGN_OUT'
  | 'USER_POOL_CLIENT_ID'
  | 'USER_POOL_ID'
>

const USER_POOL_ID_PATTERN = /^[a-z0-9-]+_[A-Za-z0-9]+$/

const hasValue = (value: string) => value.trim().length > 0

const isUrl = (value: string) => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const isValidUserPoolId = (value: string) =>
  USER_POOL_ID_PATTERN.test(value)

export const getCognitoConfigError = (config: CognitoConfig): string | null => {
  if (!hasValue(config.AWS_REGION)) {
    return 'AWS region is missing.'
  }

  if (!isValidUserPoolId(config.USER_POOL_ID)) {
    return 'Cognito user pool ID is invalid.'
  }

  if (!hasValue(config.USER_POOL_CLIENT_ID)) {
    return 'Cognito user pool client ID is missing.'
  }

  if (!isUrl(config.COGNITO_DOMAIN)) {
    return 'Cognito domain is invalid.'
  }

  if (!isUrl(config.COGNITO_REDIRECT_SIGN_IN)) {
    return 'Cognito sign-in redirect URL is invalid.'
  }

  if (!isUrl(config.COGNITO_REDIRECT_SIGN_OUT)) {
    return 'Cognito sign-out redirect URL is invalid.'
  }

  return null
}

export const isCognitoConfigValid = (config: CognitoConfig) =>
  getCognitoConfigError(config) === null
