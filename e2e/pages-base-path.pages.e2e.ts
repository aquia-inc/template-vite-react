import { expect, test, type Page } from '@playwright/test'

const basePath = '/template-vite-react'
const demoEmail = 'pages@example.com'
const demoPassword = 'password123'

const pagesUrl = (path = '/') => `${basePath}${path}`

const signInWithDemoAuth = async (page: Page) => {
  await page.locator('#email-input').fill(demoEmail)
  await page.locator('#password-input').fill(demoPassword)
  await page.getByRole('button', { name: 'Sign In' }).click()
}

test('pages build serves the public entry from the configured base path', async ({
  page,
}) => {
  await page.goto(pagesUrl('/'))

  await expect(
    page.getByRole('heading', {
      name: /Start from a working React foundation instead of an empty repo\./i,
    }),
  ).toBeVisible()
  await expect(page.locator('#root')).not.toBeEmpty()

  const assetScript = page
    .locator('script[src^="/template-vite-react/assets/"]')
    .first()
  await expect(assetScript).toHaveAttribute(
    'src',
    /^\/template-vite-react\/assets\//,
  )

  const assetPath = await assetScript.getAttribute('src')
  expect(assetPath).toBeTruthy()

  const assetResponse = await page.request.get(assetPath ?? '')
  expect(assetResponse.ok()).toBe(true)
})

test('pages build falls back to the SPA for a protected base-path route', async ({
  page,
}) => {
  await page.goto(pagesUrl('/app'))

  await expect(page).toHaveURL(new RegExp(`${basePath}/auth/login$`))
  await expect(page.locator('#login-form')).toBeVisible()

  await signInWithDemoAuth(page)

  await expect(page).toHaveURL(new RegExp(`${basePath}/app$`))
  await expect(page.getByTestId('appbar-title')).toHaveText('Dashboard')
  await expect(
    page.getByRole('heading', { name: /Welcome User\s+pages/i }),
  ).toBeVisible()
})
