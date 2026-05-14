import { expect, test, type Page } from '@playwright/test'

const demoEmail = 'pages@example.com'
const demoPassword = 'password123'

const getBasePath = (baseURL: string | undefined) => {
  const pathname = new URL(baseURL ?? 'http://127.0.0.1/').pathname
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const pagesUrl = (baseURL: string | undefined, path = '/') =>
  `${getBasePath(baseURL)}${path}`

const signInWithDemoAuth = async (page: Page) => {
  await page.locator('#email-input').fill(demoEmail)
  await page.locator('#password-input').fill(demoPassword)
  await page.getByRole('button', { name: 'Sign In' }).click()
}

test('pages build serves the public entry from the configured base path', async ({
  baseURL,
  page,
}) => {
  const basePath = getBasePath(baseURL)

  await page.goto(pagesUrl(baseURL, '/'))

  await expect(
    page.getByRole('heading', {
      name: /Start from a working React foundation instead of an empty repo\./i,
    }),
  ).toBeVisible()
  await expect(page.locator('#root')).not.toBeEmpty()

  const assetScript = page.locator(`script[src^="${basePath}/assets/"]`).first()
  await expect(assetScript).toHaveAttribute(
    'src',
    new RegExp(`^${escapeRegExp(basePath)}/assets/`),
  )

  const assetPath = await assetScript.getAttribute('src')
  expect(assetPath).toBeTruthy()

  const assetResponse = await page.request.get(assetPath ?? '')
  expect(assetResponse.ok()).toBe(true)
})

test('pages build falls back to the SPA for a protected base-path route', async ({
  baseURL,
  page,
}) => {
  const basePath = getBasePath(baseURL)

  await page.goto(pagesUrl(baseURL, '/app'))

  await expect(page).toHaveURL(
    new RegExp(`${escapeRegExp(basePath)}/auth/login$`),
  )
  await expect(page.locator('#login-form')).toBeVisible()

  await signInWithDemoAuth(page)

  await expect(page).toHaveURL(new RegExp(`${escapeRegExp(basePath)}/app$`))
  await expect(page.getByTestId('appbar-title')).toHaveText('Dashboard')
  await expect(
    page.getByRole('heading', { name: /Welcome User\s+pages/i }),
  ).toBeVisible()
})
