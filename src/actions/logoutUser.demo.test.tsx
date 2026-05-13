import { signOut } from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import logoutUser from '@/actions/logoutUser'
import {
  createDemoAuthState,
  getDemoAuthSession,
  saveDemoAuthSession,
} from '@/utils/demoAuth'

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
  window.sessionStorage.clear()
})

test('clears demo auth state without calling Amplify signOut', async () => {
  const dispatch = jest.fn()
  saveDemoAuthSession(createDemoAuthState('reviewer@example.com'))

  await logoutUser(dispatch)

  expect(signOut).not.toHaveBeenCalled()
  expect(getDemoAuthSession()).toBeNull()
  expect(dispatch).toHaveBeenCalledWith({ type: AuthActions.LOGOUT })
})
