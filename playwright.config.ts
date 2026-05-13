import { defineConfig } from '@playwright/test'

const devBaseURL = 'http://127.0.0.1:4173'
const pagesBaseURL = 'http://127.0.0.1:4174'
const pagesBasePath = '/template-vite-react/'
const isCI = process.env.CI === 'true'

const demoAuthEnv = {
  VITE_AWS_REGION: '',
  VITE_CF_DOMAIN: devBaseURL,
  VITE_COGNITO_DOMAIN: '',
  VITE_COGNITO_REDIRECT_SIGN_IN: '',
  VITE_COGNITO_REDIRECT_SIGN_OUT: '',
  VITE_DEMO_AUTH_ENABLED: 'true',
  VITE_IDP_ENABLED: 'false',
  VITE_USER_POOL_CLIENT_ID: '',
  VITE_USER_POOL_ID: '',
}

const pagesEnv = {
  ...demoAuthEnv,
  VITE_CF_DOMAIN: pagesBaseURL,
  VITE_PUBLIC_BASE_PATH: pagesBasePath,
}

export default defineConfig({
  testDir: './e2e',
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'yarn dev:e2e',
      env: {
        ...process.env,
        ...demoAuthEnv,
      },
      url: devBaseURL,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command: 'yarn build && node e2e/pages-static-server.mjs',
      env: {
        ...process.env,
        ...pagesEnv,
      },
      url: `${pagesBaseURL}${pagesBasePath}`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium-dev',
      testMatch: '**/*.dev.e2e.ts',
      use: {
        baseURL: devBaseURL,
        browserName: 'chromium',
      },
    },
    {
      name: 'chromium-pages',
      testMatch: '**/*.pages.e2e.ts',
      use: {
        baseURL: pagesBaseURL,
        browserName: 'chromium',
      },
    },
  ],
})
