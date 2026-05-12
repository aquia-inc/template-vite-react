const validAuthEnv = {
  VITE_AWS_REGION: 'us-east-1',
  VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
  VITE_COGNITO_REDIRECT_SIGN_IN: 'https://localhost:3000/auth/login',
  VITE_COGNITO_REDIRECT_SIGN_OUT: 'https://localhost:3000/auth/logout',
  VITE_USER_POOL_CLIENT_ID: '1234567890123456789012',
  VITE_USER_POOL_ID: 'us-east-1_123456789',
}

const runWithEnv = (
  env: NodeJS.ProcessEnv,
  assertion: (params: {
    configureCognito: () => null
    configure: jest.Mock
  }) => void,
) => {
  const originalEnv = process.env

  jest.resetModules()
  process.env = {
    ...originalEnv,
    ...env,
  }

  try {
    jest.isolateModules(() => {
      const { Amplify } = require('aws-amplify')
      const configureCognito = require('@/utils/configureCognito').default

      assertion({
        configureCognito,
        configure: Amplify.configure,
      })
    })
  } finally {
    process.env = originalEnv
  }
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('configures Amplify Auth with the v6 Cognito shape when auth is enabled', () => {
  runWithEnv(validAuthEnv, ({ configureCognito, configure }) => {
    const result = configureCognito()

    expect(result).toBeNull()
    expect(configure).toHaveBeenCalledWith({
      Auth: {
        Cognito: {
          userPoolId: validAuthEnv.VITE_USER_POOL_ID,
          userPoolClientId: validAuthEnv.VITE_USER_POOL_CLIENT_ID,
          loginWith: {
            oauth: {
              domain: validAuthEnv.VITE_COGNITO_DOMAIN,
              scopes: ['openid', 'email', 'profile'],
              redirectSignIn: [validAuthEnv.VITE_COGNITO_REDIRECT_SIGN_IN],
              redirectSignOut: [validAuthEnv.VITE_COGNITO_REDIRECT_SIGN_OUT],
              responseType: 'code',
            },
          },
        },
      },
    })
  })
})

test('skips Amplify.configure when auth is disabled by blank Cognito env', () => {
  runWithEnv(
    {
      VITE_AWS_REGION: '',
      VITE_COGNITO_DOMAIN: '',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    },
    ({ configureCognito, configure }) => {
      const result = configureCognito()

      expect(result).toBeNull()
      expect(configure).not.toHaveBeenCalled()
    },
  )
})
