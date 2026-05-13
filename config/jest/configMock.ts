import { createAppConfig } from '@/utils/appConfig'

const CONFIG = createAppConfig({
  VITE_CF_DOMAIN: process.env.VITE_CF_DOMAIN ?? 'https://localhost:3000/',
  VITE_DEMO_AUTH_ENABLED: process.env.VITE_DEMO_AUTH_ENABLED ?? 'false',
  VITE_PUBLIC_BASE_PATH: process.env.VITE_PUBLIC_BASE_PATH ?? '/',
  ...process.env,
})

export default CONFIG
