import { signOut } from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import logoutUser from '@/actions/logoutUser'

describe('logoutUser action', () => {
  test('calls signOut', async () => {
    const dispatch = jest.fn()

    await logoutUser(dispatch)

    expect(signOut).toHaveBeenCalled()
  })

  test('dispatches LOGOUT action', async () => {
    const dispatch = jest.fn()

    await logoutUser(dispatch)

    expect(dispatch).toHaveBeenCalledWith({ type: AuthActions.LOGOUT })
  })
})
