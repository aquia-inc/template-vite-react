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
  if (!CONFIG.AUTH_ENABLED) {
    return null
  }

  // Configure Amplify Auth with the Cognito User Pool
  Amplify.configure({
    Auth: {
      region: CONFIG.AWS_REGION,
      userPoolId: CONFIG.USER_POOL_ID,
      userPoolWebClientId: CONFIG.USER_POOL_CLIENT_ID,
      oauth: {
        domain: CONFIG.COGNITO_DOMAIN,
        scope: ['openid', 'email', 'profile'],
        redirectSignIn: CONFIG.COGNITO_REDIRECT_SIGN_IN,
        redirectSignOut: CONFIG.COGNITO_REDIRECT_SIGN_OUT,
        responseType: 'code',
      },
    },
  })

  // a loader has to return something or null
  return null
}

export default configureCognito
