import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signIn,
} from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import loginUser from '@/actions/loginUser'

const mockDispatch = jest.fn()

const mockSession = (jwtToken: string | undefined = 'jwtToken') => ({
  tokens: {
    accessToken: {
      toString: () => jwtToken,
    },
  },
})

describe('loginUser action', () => {
  const payload = { email: 'test@test.com', password: 'password' }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(signIn as jest.Mock).mockResolvedValue({
      isSignedIn: true,
      nextStep: { signInStep: 'DONE' },
    })
    ;(fetchAuthSession as jest.Mock).mockResolvedValue(mockSession())
    ;(getCurrentUser as jest.Mock).mockResolvedValue({ username: 'username' })
    ;(fetchUserAttributes as jest.Mock).mockResolvedValue({
      email: payload.email,
    })
  })

  test('dispatches LOGIN_REQUEST action', async () => {
    await loginUser(mockDispatch, payload)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_REQUEST,
    })
  })

  test('calls signIn and fetchAuthSession on successful login', async () => {
    await loginUser(mockDispatch, payload)
    expect(signIn).toHaveBeenCalledWith({
      username: payload.email,
      password: payload.password,
    })
    expect(fetchAuthSession).toHaveBeenCalled()
  })

  test('dispatches LOGIN_SUCCESS action on successful login with the correct payload', async () => {
    await loginUser(mockDispatch, payload)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_SUCCESS,
      payload: {
        jwtToken: 'jwtToken',
        email: payload.email,
        username: 'username',
      },
    })
  })

  test('dispatches LOGIN_FAILURE action on failed login', async () => {
    ;(signIn as jest.Mock).mockRejectedValue(new Error('Login failed'))
    await loginUser(mockDispatch, payload)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_FAILURE,
      error: new Error('Login failed'),
    })
  })

  test('dispatches LOGIN_FAILURE action if the session is not valid', async () => {
    ;(signIn as jest.Mock).mockResolvedValue({ isSignedIn: false })
    await loginUser(mockDispatch, payload)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_FAILURE,
      error: new Error('Invalid user session'),
    })
  })

  test('dispatches LOGIN_FAILURE action if the jwtToken is not valid', async () => {
    ;(fetchAuthSession as jest.Mock).mockResolvedValue(mockSession(''))
    await loginUser(mockDispatch, payload)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_FAILURE,
      error: new Error('No JWT token'),
    })
  })

  test('dispatches LOGIN_FAILURE action if the user object is not valid', async () => {
    ;(getCurrentUser as jest.Mock).mockResolvedValue({})
    await loginUser(mockDispatch, payload)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_FAILURE,
      error: new Error('Invalid user'),
    })
  })
})
