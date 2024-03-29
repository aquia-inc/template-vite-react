/**
 * Configures Amazon Cognito auth in the root loader of the router.
 * @module utils/configureCognito
 * @see {@link dashboard/router/routes.tsx}
 */
/**
 * Configures Amazon Cognito auth in the root loader of the router.
 * @see {@link dashboard/craco.config.js}.
 */
import { Amplify } from 'aws-amplify'
import CONFIG from '@/utils/config'

function configureCognito(): null {
  const options = {
    region: CONFIG.AWS_REGION,
    userPoolId: CONFIG.USER_POOL_ID || new Error('USER_POOL_ID is not defined'),
    userPoolWebClientId:
      CONFIG.USER_POOL_CLIENT_ID ||
      new Error('USER_POOL_CLIENT_ID is not defined'),
  }

  const oauth = {
    domain: CONFIG.COGNITO_DOMAIN || new Error('COGNITO_DOMAIN is not defined'),
    scope: ['openid', 'email', 'profile'],
    redirectSignIn: CONFIG.COGNITO_REDIRECT_SIGN_IN,
    redirectSignOut: CONFIG.COGNITO_REDIRECT_SIGN_OUT,
    responseType: 'code',
  }

  // Configure Amplify Auth with the Cognito User Pool
  Amplify.configure({
    Auth: {
      ...options,
      oauth,
    },
  })

  // a loader has to return something or null
  return null
}

export default configureCognito
