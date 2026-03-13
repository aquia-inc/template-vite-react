import { expect, test } from '@playwright/test'

test('renders the login view', async ({ page }) => {
  await page.goto('/auth/login')

  await expect(page.locator('#login-form')).toBeVisible()
  await expect(page.locator('#email-input')).toBeVisible()
  await expect(page.locator('#password-input')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: /Welcome to the app!/i }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
})
