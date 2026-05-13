/**
 * Action that logs out the current Cognito user.
 * @module actions/logoutUser
 */
import { signOut } from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import { AuthActionParams } from '@/store/auth/types'
import CONFIG from '@/utils/config'
import { clearDemoAuthSession } from '@/utils/demoAuth'

export default async function logoutUser(
  dispatch: React.Dispatch<AuthActionParams>,
) {
  if (CONFIG.DEMO_AUTH_ENABLED) {
    clearDemoAuthSession()
  } else {
    await signOut()
  }

  dispatch({ type: AuthActions.LOGOUT })
}
