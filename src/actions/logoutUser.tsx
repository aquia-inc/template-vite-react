/**
 * Action that logs out the current Cognito user.
 * @module actions/logoutUser
 */
import { Auth } from 'aws-amplify'
import { AuthActions } from '@/actions/actionTypes'
import { AuthActionParams } from '@/store/auth/types'

export default async function logoutUser(
  dispatch: React.Dispatch<AuthActionParams>
) {
  await Auth.signOut()
  dispatch({ type: AuthActions.LOGOUT })
}
