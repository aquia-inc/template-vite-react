import { defineConfig } from '@playwright/test'

const devBaseURL = 'http://127.0.0.1:4173'
const pagesBaseURL = 'http://127.0.0.1:4174'
const isCI = process.env.CI === 'true'
const normalizePagesBasePath = (value = '/template-vite-react/') => {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`

  return withLeadingSlash.endsWith('/')
    ? withLeadingSlash
    : `${withLeadingSlash}/`
}
const pagesBasePath = normalizePagesBasePath(process.env.PAGES_E2E_BASE_PATH)
const requestedProjects = process.argv.flatMap((arg, index, args) => {
  if (arg.startsWith('--project=')) {
    return [arg.slice('--project='.length)]
  }

  if (arg === '--project' && args[index + 1]) {
    return [args[index + 1]]
  }

  return []
})
const shouldRunProject = (projectName: string) =>
  requestedProjects.length === 0 || requestedProjects.includes(projectName)

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
  PAGES_E2E_BASE_PATH: pagesBasePath,
  VITE_CF_DOMAIN: pagesBaseURL,
  VITE_PUBLIC_BASE_PATH: pagesBasePath,
}

const webServer = [
  ...(shouldRunProject('chromium-dev')
    ? [
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
      ]
    : []),
  ...(shouldRunProject('chromium-pages')
    ? [
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
      ]
    : []),
]

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
  webServer,
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
        baseURL: `${pagesBaseURL}${pagesBasePath}`,
        browserName: 'chromium',
      },
    },
  ],
})
