import { Routes } from '@/router/constants'
import { createDemoAuthState, saveDemoAuthSession } from '@/utils/demoAuth'

jest.mock('@/utils/config', () => {
  const { createAppConfig } = jest.requireActual('@/utils/appConfig')

  return {
    __esModule: true,
    default: createAppConfig({
      VITE_DEMO_AUTH_ENABLED: 'true',
      VITE_AWS_REGION: '',
      VITE_COGNITO_DOMAIN: '',
      VITE_COGNITO_REDIRECT_SIGN_IN: '',
      VITE_COGNITO_REDIRECT_SIGN_OUT: '',
      VITE_USER_POOL_CLIENT_ID: '',
      VITE_USER_POOL_ID: '',
    }),
  }
})

beforeEach(() => {
  window.sessionStorage.clear()
})

test('allows a demo auth session to access protected routes', async () => {
  const authLoader = (await import('@/router/authLoader')).default
  saveDemoAuthSession(createDemoAuthState('reviewer@example.com'))

  await expect(authLoader()).resolves.toBeNull()
})

test('redirects protected routes to login when demo auth has no session', async () => {
  const authLoader = (await import('@/router/authLoader')).default
  const response = await authLoader()

  expect(response).toBeInstanceOf(Response)
  expect(response?.headers.get('Location')).toBe(Routes.AUTH_LOGIN)
})

test('redirects demo auth users away from the home route to the dashboard', async () => {
  const homeLoader = (await import('@/router/homeLoader')).default
  saveDemoAuthSession(createDemoAuthState('reviewer@example.com'))

  const response = await homeLoader()

  expect(response).toBeInstanceOf(Response)
  expect(response?.headers.get('Location')).toBe(Routes.DASHBOARD)
})
