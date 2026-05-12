import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173'
const isCI = process.env.CI === 'true'
const e2eEnv = {
  VITE_AWS_REGION: 'us-east-1',
  VITE_CF_DOMAIN: baseURL,
  VITE_COGNITO_DOMAIN: 'https://example.auth.us-east-1.amazoncognito.com',
  VITE_COGNITO_REDIRECT_SIGN_IN: `${baseURL}/auth/login`,
  VITE_COGNITO_REDIRECT_SIGN_OUT: `${baseURL}/auth/logout`,
  VITE_USER_POOL_CLIENT_ID: '12345678901234567890123456',
  VITE_USER_POOL_ID: 'us-east-1_abcd1234',
  VITE_IDP_ENABLED: 'false',
}

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'yarn dev:e2e',
    env: {
      ...process.env,
      ...e2eEnv,
    },
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
})
