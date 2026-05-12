/**
 * Action that logs out the current Cognito user.
 * @module actions/logoutUser
 */
import { signOut } from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import { AuthActionParams } from '@/store/auth/types'

export default async function logoutUser(
  dispatch: React.Dispatch<AuthActionParams>,
) {
  await signOut()
  dispatch({ type: AuthActions.LOGOUT })
}
