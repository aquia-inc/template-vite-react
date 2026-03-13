import { Amplify } from 'aws-amplify'
import configureCognito from '@/utils/configureCognito'

beforeEach(() => {
  jest.resetAllMocks()
})

afterAll(() => {
  jest.clearAllMocks()
})

test('calls Auth.configure', () => {
  configureCognito()
  expect(Amplify.configure).toHaveBeenCalled()
})

test('returns null', () => {
  const result = configureCognito()
  expect(result).toBeNull()
})

test('skips Amplify.configure when auth is disabled', () => {
  const originalEnv = {
    ...process.env,
  }

  jest.resetModules()
  process.env.VITE_AWS_REGION = ''
  process.env.VITE_USER_POOL_ID = ''
  process.env.VITE_USER_POOL_CLIENT_ID = ''
  process.env.VITE_COGNITO_DOMAIN = ''
  process.env.VITE_COGNITO_REDIRECT_SIGN_IN = ''
  process.env.VITE_COGNITO_REDIRECT_SIGN_OUT = ''

  jest.isolateModules(() => {
    const { Amplify: isolatedAmplify } = require('aws-amplify')
    const isolatedConfigureCognito = require('@/utils/configureCognito').default

    isolatedConfigureCognito()
    expect(isolatedAmplify.configure).not.toHaveBeenCalled()
  })

  Object.assign(process.env, originalEnv)
})
