import { signIn } from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import loginUser from '@/actions/loginUser'
import { getDemoAuthSession } from '@/utils/demoAuth'

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

test('signs in a demo user without calling Amplify signIn', async () => {
  const dispatch = jest.fn()
  const payload = { email: 'reviewer@example.com', password: 'password' }

  const data = await loginUser(dispatch, payload)

  expect(signIn).not.toHaveBeenCalled()
  expect(data).toEqual({
    jwtToken: 'demo-auth-token',
    username: 'reviewer',
    email: payload.email,
  })
  expect(getDemoAuthSession()).toEqual(data)
  expect(dispatch).toHaveBeenCalledWith({ type: AuthActions.LOGIN_REQUEST })
  expect(dispatch).toHaveBeenCalledWith({
    type: AuthActions.LOGIN_SUCCESS,
    payload: data,
  })
})
