/**
 * Helper to return the Cognito JWT Token from the current session.
 * @module utils/getJWT
 */
import { fetchAuthSession } from 'aws-amplify/auth'
import AuthError from '@/errors/AuthError'
import CONFIG from '@/utils/config'
import { getDemoAuthSession } from '@/utils/demoAuth'

/**
 * Get the Cognito JWT Token from the current session.
 * @returns {Promise<string>} The Cognito JWT Token.
 */
const getJWT = async (): Promise<string> => {
  if (CONFIG.DEMO_AUTH_ENABLED) {
    const jwtToken = getDemoAuthSession()?.jwtToken

    if (!jwtToken) {
      throw new AuthError().toResponse()
    }

    return jwtToken
  }

  const session = await fetchAuthSession()
  const jwtToken = session.tokens?.accessToken?.toString()

  if (!jwtToken) {
    throw new AuthError().toResponse()
  }

  return jwtToken
}

export default getJWT
