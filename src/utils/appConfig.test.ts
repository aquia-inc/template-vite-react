import { createAppConfig } from '@/utils/appConfig'

const validCognitoEnv = {
  VITE_AWS_REGION: 'us-east-1',
  VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
  VITE_COGNITO_REDIRECT_SIGN_IN: 'https://localhost:3000/auth/login',
  VITE_COGNITO_REDIRECT_SIGN_OUT: 'https://localhost:3000/auth/logout',
  VITE_USER_POOL_CLIENT_ID: '1234567890123456789012',
  VITE_USER_POOL_ID: 'us-east-1_123456789',
}

test('enables real Cognito auth when Cognito config is valid', () => {
  const config = createAppConfig(validCognitoEnv)

  expect(config.COGNITO_AUTH_ENABLED).toBe(true)
  expect(config.DEMO_AUTH_ENABLED).toBe(false)
  expect(config.AUTH_ENABLED).toBe(true)
})

test('enables demo auth when requested and Cognito config is blank', () => {
  const config = createAppConfig({
    VITE_DEMO_AUTH_ENABLED: 'true',
    VITE_AWS_REGION: '',
    VITE_COGNITO_DOMAIN: '',
    VITE_COGNITO_REDIRECT_SIGN_IN: '',
    VITE_COGNITO_REDIRECT_SIGN_OUT: '',
    VITE_USER_POOL_CLIENT_ID: '',
    VITE_USER_POOL_ID: '',
  })

  expect(config.COGNITO_AUTH_ENABLED).toBe(false)
  expect(config.DEMO_AUTH_ENABLED).toBe(true)
  expect(config.AUTH_ENABLED).toBe(true)
})

test('keeps auth disabled when Cognito and demo auth are both unavailable', () => {
  const config = createAppConfig({
    VITE_DEMO_AUTH_ENABLED: 'false',
    VITE_AWS_REGION: '',
    VITE_COGNITO_DOMAIN: '',
    VITE_COGNITO_REDIRECT_SIGN_IN: '',
    VITE_COGNITO_REDIRECT_SIGN_OUT: '',
    VITE_USER_POOL_CLIENT_ID: '',
    VITE_USER_POOL_ID: '',
  })

  expect(config.COGNITO_AUTH_ENABLED).toBe(false)
  expect(config.DEMO_AUTH_ENABLED).toBe(false)
  expect(config.AUTH_ENABLED).toBe(false)
})

test('prefers real Cognito auth when both Cognito and demo auth are configured', () => {
  const config = createAppConfig({
    ...validCognitoEnv,
    VITE_DEMO_AUTH_ENABLED: 'true',
  })

  expect(config.COGNITO_AUTH_ENABLED).toBe(true)
  expect(config.DEMO_AUTH_ENABLED).toBe(false)
  expect(config.AUTH_ENABLED).toBe(true)
})
