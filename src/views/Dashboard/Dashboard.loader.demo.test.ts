import { getCurrentUser } from 'aws-amplify/auth'
import dashboardLoader from '@/views/Dashboard/Dashboard.loader'
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
  jest.clearAllMocks()
  window.localStorage.clear()
})

test('returns the demo username without calling Amplify', async () => {
  saveDemoAuthSession(createDemoAuthState('reviewer@example.com'))

  await expect(dashboardLoader()).resolves.toEqual({ username: 'reviewer' })
  expect(getCurrentUser).not.toHaveBeenCalled()
})
