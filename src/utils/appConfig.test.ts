import { createAppConfig, getAppConfigProfile } from '@/utils/appConfig'

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

test('returns the cognito profile when Cognito config is valid', () => {
  const result = getAppConfigProfile(validCognitoEnv)

  expect(result).toEqual({
    profile: 'cognito',
    authEnabled: true,
    cognitoAuthEnabled: true,
    demoAuthEnabled: false,
    warnings: [],
  })
})

test('returns the local demo profile when demo auth is requested and Cognito config is blank', () => {
  const result = getAppConfigProfile({
    VITE_DEMO_AUTH_ENABLED: 'true',
    VITE_PUBLIC_BASE_PATH: '/',
    VITE_AWS_REGION: 'us-east-1',
    VITE_COGNITO_DOMAIN: '',
    VITE_COGNITO_REDIRECT_SIGN_IN: '',
    VITE_COGNITO_REDIRECT_SIGN_OUT: '',
    VITE_USER_POOL_CLIENT_ID: '',
    VITE_USER_POOL_ID: '',
  })

  expect(result.profile).toBe('local-demo')
  expect(result.authEnabled).toBe(true)
  expect(result.cognitoAuthEnabled).toBe(false)
  expect(result.demoAuthEnabled).toBe(true)
  expect(result.warnings).toEqual([])
})

test('returns the pages demo profile for non-root demo builds with blank Cognito config', () => {
  const result = getAppConfigProfile({
    VITE_DEMO_AUTH_ENABLED: 'true',
    VITE_PUBLIC_BASE_PATH: '/template-vite-react/',
    VITE_AWS_REGION: 'us-east-1',
    VITE_COGNITO_DOMAIN: '',
    VITE_COGNITO_REDIRECT_SIGN_IN: '',
    VITE_COGNITO_REDIRECT_SIGN_OUT: '',
    VITE_USER_POOL_CLIENT_ID: '',
    VITE_USER_POOL_ID: '',
  })

  expect(result.profile).toBe('pages-demo')
  expect(result.authEnabled).toBe(true)
  expect(result.cognitoAuthEnabled).toBe(false)
  expect(result.demoAuthEnabled).toBe(true)
  expect(result.warnings).toEqual([])
})

test('returns the local disabled profile when Cognito config is blank and demo auth is not requested', () => {
  const result = getAppConfigProfile({
    VITE_DEMO_AUTH_ENABLED: 'false',
    VITE_PUBLIC_BASE_PATH: '/',
    VITE_AWS_REGION: 'us-east-1',
    VITE_CF_DOMAIN: 'https://localhost:3000',
    VITE_COGNITO_DOMAIN: '',
    VITE_COGNITO_REDIRECT_SIGN_IN: '',
    VITE_COGNITO_REDIRECT_SIGN_OUT: '',
    VITE_USER_POOL_CLIENT_ID: '',
    VITE_USER_POOL_ID: '',
  })

  expect(result).toEqual({
    profile: 'local-disabled',
    authEnabled: false,
    cognitoAuthEnabled: false,
    demoAuthEnabled: false,
    warnings: [],
  })
})

test('returns warnings without enabling demo auth when demo auth conflicts with partial Cognito config', () => {
  const result = getAppConfigProfile({
    VITE_DEMO_AUTH_ENABLED: 'true',
    VITE_AWS_REGION: 'us-east-1',
    VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
    VITE_COGNITO_REDIRECT_SIGN_IN: '',
    VITE_COGNITO_REDIRECT_SIGN_OUT: '',
    VITE_USER_POOL_CLIENT_ID: '',
    VITE_USER_POOL_ID: '',
  })

  expect(result.profile).toBe('unknown')
  expect(result.authEnabled).toBe(false)
  expect(result.cognitoAuthEnabled).toBe(false)
  expect(result.demoAuthEnabled).toBe(false)
  expect(result.warnings).toEqual([
    'Demo auth was requested but Cognito environment values are partially configured. Leave all Cognito values blank for demo auth.',
    'Cognito environment values are partially configured but invalid: Cognito user pool ID is invalid.',
  ])
})

test('returns Cognito profile with a warning when valid Cognito config overrides requested demo auth', () => {
  const result = getAppConfigProfile({
    ...validCognitoEnv,
    VITE_DEMO_AUTH_ENABLED: 'true',
  })

  expect(result.profile).toBe('cognito')
  expect(result.authEnabled).toBe(true)
  expect(result.cognitoAuthEnabled).toBe(true)
  expect(result.demoAuthEnabled).toBe(false)
  expect(result.warnings).toEqual([
    'Demo auth was requested but valid Cognito config is present. Cognito auth takes precedence.',
  ])
})

test('enables demo auth when requested and Cognito config is blank', () => {
  const config = createAppConfig({
    VITE_DEMO_AUTH_ENABLED: 'true',
    VITE_AWS_REGION: 'us-east-1',
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
    VITE_AWS_REGION: 'us-east-1',
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

test('keeps createAppConfig backward compatible with partial Vite env objects', () => {
  const config = createAppConfig({
    VITE_DEMO_AUTH_ENABLED: 'false',
  })

  expect(config.AWS_REGION).toBe('')
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

test('keeps demo auth disabled when Cognito config is partially set and invalid', () => {
  const config = createAppConfig({
    VITE_DEMO_AUTH_ENABLED: 'true',
    VITE_AWS_REGION: 'us-east-1',
    VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
    VITE_COGNITO_REDIRECT_SIGN_IN: '',
    VITE_COGNITO_REDIRECT_SIGN_OUT: '',
    VITE_USER_POOL_CLIENT_ID: '',
    VITE_USER_POOL_ID: '',
  })

  expect(config.COGNITO_AUTH_ENABLED).toBe(false)
  expect(config.DEMO_AUTH_ENABLED).toBe(false)
  expect(config.AUTH_ENABLED).toBe(false)
})
