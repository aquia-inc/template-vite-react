import { expect, test, type Page } from '@playwright/test'

const demoEmail = 'reviewer@example.com'
const demoPassword = 'password123'

const expectDashboard = async (page: Page, username = 'reviewer') => {
  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByTestId('app')).toBeVisible()
  await expect(page.getByTestId('appbar-title')).toHaveText('Dashboard')
  await expect(
    page.getByRole('heading', {
      name: new RegExp(`Welcome User\\s+${username}`),
    }),
  ).toBeVisible()
}

const signInWithDemoAuth = async (page: Page, email = demoEmail) => {
  await page.goto('/auth/login')
  await page.locator('#email-input').fill(email)
  await page.locator('#password-input').fill(demoPassword)
  await page.getByRole('button', { name: 'Sign In' }).click()
}

test('dev server renders the public home page', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: /Start from a working React foundation instead of an empty repo\./i,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Open sign-in flow' }),
  ).toBeVisible()
})

test('dev server redirects protected app routes without a demo session', async ({
  page,
}) => {
  await page.goto('/app')

  await expect(page).toHaveURL(/\/auth\/login$/)
  await expect(page.locator('#login-form')).toBeVisible()
})

test('dev server exposes demo auth mode and reaches the dashboard', async ({
  page,
}) => {
  await page.goto('/auth/login')

  await expect(page.locator('#login-form')).toBeVisible()
  await expect(
    page.getByText(
      /Demo auth mode is enabled\. Any valid email and password will open the demo app\./i,
    ),
  ).toBeVisible()

  await signInWithDemoAuth(page)
  await expectDashboard(page)
})

test('dev server renders the authenticated dashboard on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })

  await signInWithDemoAuth(page, 'mobile@example.com')

  await expectDashboard(page, 'mobile')
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
})
