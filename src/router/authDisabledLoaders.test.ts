import { Routes } from '@/router/constants'

jest.mock('@/utils/config', () => {
  const { createAppConfig } = jest.requireActual('@/utils/appConfig')

  return {
    __esModule: true,
    default: createAppConfig({
      VITE_DEMO_AUTH_ENABLED: 'false',
      VITE_AWS_REGION: '',
      VITE_COGNITO_DOMAIN: '',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
  }
})

test('redirects protected routes home when auth is disabled', async () => {
  const authLoader = (await import('@/router/authLoader')).default
  const response = await authLoader()

  expect(response).toBeInstanceOf(Response)
  expect(response?.headers.get('Location')).toBe(Routes.HOME)
})

test('does not redirect home route when auth is disabled', async () => {
  const homeLoader = (await import('@/router/homeLoader')).default

  await expect(homeLoader()).resolves.toBeNull()
})
