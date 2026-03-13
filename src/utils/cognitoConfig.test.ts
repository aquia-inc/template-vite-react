import {
  getCognitoConfigError,
  isCognitoConfigValid,
  isValidUserPoolId,
} from '@/utils/cognitoConfig'

const validConfig = {
  AWS_REGION: 'us-east-1',
  COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
  COGNITO_REDIRECT_SIGN_IN: 'https://localhost:3000/sign-in',
  COGNITO_REDIRECT_SIGN_OUT: 'https://localhost:3000/sign-out',
  USER_POOL_CLIENT_ID: '1234567890123456789012',
  USER_POOL_ID: 'us-east-1_123456789',
}

test('accepts a valid Cognito user pool id', () => {
  expect(isValidUserPoolId('us-east-1_123456789')).toBe(true)
})

test('rejects an invalid Cognito user pool id', () => {
  expect(isValidUserPoolId('invalid-user-pool')).toBe(false)
})

test('returns null when the Cognito config is valid', () => {
  expect(getCognitoConfigError(validConfig)).toBeNull()
  expect(isCognitoConfigValid(validConfig)).toBe(true)
})

test('returns an error when the Cognito config is incomplete', () => {
  expect(
    getCognitoConfigError({
      ...validConfig,
      USER_POOL_ID: '',
    }),
  ).toBe('Cognito user pool ID is invalid.')
})
