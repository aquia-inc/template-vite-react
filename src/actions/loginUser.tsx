/**
 * Action that logs in a user with the given email and password
 * @module actions/loginUser
 */
import React from 'react'
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signIn,
} from 'aws-amplify/auth'
import { AuthActions } from '@/actions/actionTypes'
import { LoginParams } from '@/hooks/types'
import { AuthActionParams } from '@/store/auth/types'
import CONFIG from '@/utils/config'
import { createDemoAuthState, saveDemoAuthSession } from '@/utils/demoAuth'

type UserData = {
  jwtToken: string
  email: string
  username: string
}

export default async function loginUser(
  dispatch: React.Dispatch<AuthActionParams>,
  payload: LoginParams,
): Promise<UserData | undefined> {
  try {
    dispatch({ type: AuthActions.LOGIN_REQUEST })

    if (CONFIG.DEMO_AUTH_ENABLED) {
      const data = createDemoAuthState(payload.email) as UserData
      saveDemoAuthSession(data)
      dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: data })

      return data
    }

    const signInResult = await signIn({
      username: payload.email,
      password: payload.password,
    })

    if (!signInResult.isSignedIn) {
      throw new Error('Invalid user session')
    }

    const [session, user, attributes] = await Promise.all([
      fetchAuthSession(),
      getCurrentUser(),
      fetchUserAttributes(),
    ])
    const jwtToken = session.tokens?.accessToken?.toString()

    // If we don't have a jwtToken, throw an error
    if (!jwtToken) {
      throw new Error('No JWT token')
    }

    if (!user?.username) {
      throw new Error('Invalid user')
    }

    const data: UserData = {
      jwtToken,
      email: attributes.email ?? payload.email,
      username: user.username,
    }
    dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: AuthActions.LOGIN_FAILURE, error: error as Error })
  }
}
