import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import loginUserFederated from '@/actions/loginUserFederated'

const mockSession = (jwtToken: string | undefined = 'testToken') => ({
  credentials: {
    accessKeyId: 'testAccessKeyId',
    sessionToken: 'testSessionToken',
    secretAccessKey: 'testSecretAccessKey',
    expiration: new Date('2024-01-01T00:00:00.000Z'),
  },
  identityId: 'testIdentityId',
  tokens: {
    accessToken: {
      toString: () => jwtToken,
    },
  },
})

describe('loginUserFederated', () => {
  let mockDispatch: jest.Mock

  beforeEach(() => {
    mockDispatch = jest.fn()
    jest.clearAllMocks()
    ;(fetchAuthSession as jest.Mock).mockResolvedValue(mockSession())
  })

  test('dispatches LOGIN_REQUEST action', async () => {
    await loginUserFederated(mockDispatch)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_REQUEST,
    })
  })

  test('dispatches LOGIN_SUCCESS action when login is successful', async () => {
    await loginUserFederated(mockDispatch)

    expect(signInWithRedirect).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_SUCCESS,
      payload: {
        credentials: mockSession().credentials,
        identityId: 'testIdentityId',
        jwtToken: 'testToken',
      },
    })
  })

  test('dispatches LOGIN_FAILURE action when login fails', async () => {
    const mockError = new Error('login failed')

    ;(signInWithRedirect as jest.Mock).mockRejectedValue(mockError)

    await loginUserFederated(mockDispatch)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_FAILURE,
      error: mockError,
    })
  })

  test('dispatches LOGIN_FAILURE action when no JWT token is found', async () => {
    ;(fetchAuthSession as jest.Mock).mockResolvedValue(mockSession(''))

    await loginUserFederated(mockDispatch)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActions.LOGIN_FAILURE,
      error: new Error('No JWT token found'),
    })
  })
})
