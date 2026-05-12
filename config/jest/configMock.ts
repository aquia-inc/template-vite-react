import { createAppConfig } from '@/utils/appConfig'

const CONFIG = createAppConfig({
  VITE_AWS_REGION: process.env.VITE_AWS_REGION ?? 'us-east-1',
  VITE_CF_DOMAIN: process.env.VITE_CF_DOMAIN ?? 'https://localhost:3000/',
  VITE_COGNITO_DOMAIN:
    process.env.VITE_COGNITO_DOMAIN ??
    'https://example.auth.us-east-1.amazoncognito.com',
  VITE_COGNITO_REDIRECT_SIGN_IN:
    process.env.VITE_COGNITO_REDIRECT_SIGN_IN ??
    'https://localhost:3000/sign-in',
  VITE_COGNITO_REDIRECT_SIGN_OUT:
    process.env.VITE_COGNITO_REDIRECT_SIGN_OUT ??
    'https://localhost:3000/sign-out',
  VITE_IDP_ENABLED: process.env.VITE_IDP_ENABLED ?? 'false',
  VITE_USER_POOL_CLIENT_ID:
    process.env.VITE_USER_POOL_CLIENT_ID ?? '1234567890123456789012',
  VITE_USER_POOL_ID: process.env.VITE_USER_POOL_ID ?? 'us-east-1_123456789',
})

export default CONFIG
