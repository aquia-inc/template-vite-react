/**
 * Action that logs in the current Cognito user using federated sign in.
 * @module actions/loginUserFederated
 */
import React from 'react'
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'

export default async function loginUserFederated(
  dispatch: React.Dispatch<{
    type: AuthActions
    payload?: unknown
    error?: Error
  }>,
) {
  try {
    dispatch({ type: AuthActions.LOGIN_REQUEST })
    await signInWithRedirect()
    const session = await fetchAuthSession()
    const jwtToken = session.tokens?.accessToken?.toString()

    if (!jwtToken) {
      throw new Error('No JWT token found')
    }

    const data = {
      jwtToken,
      identityId: session.identityId,
      credentials: session.credentials,
    }

    dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: AuthActions.LOGIN_FAILURE, error: error as Error })
  }
}
