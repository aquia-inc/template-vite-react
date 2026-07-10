import { expect, test, type Locator, type Page } from '@playwright/test'

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

const expectDashboardFitsViewport = async (page: Page) => {
  const layout = await page.getByTestId('app').evaluate((app) => {
    const main = app.querySelector('main')
    const mainBounds = main?.getBoundingClientRect()

    return {
      appClientWidth: app.clientWidth,
      appScrollWidth: app.scrollWidth,
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      mainLeft: mainBounds?.left ?? -1,
      mainRight: mainBounds?.right ?? Number.POSITIVE_INFINITY,
    }
  })

  expect(layout.appScrollWidth).toBeLessThanOrEqual(layout.appClientWidth)
  expect(layout.documentScrollWidth).toBeLessThanOrEqual(
    layout.documentClientWidth,
  )
  expect(layout.mainLeft).toBeGreaterThanOrEqual(0)
  expect(layout.mainRight).toBeLessThanOrEqual(layout.documentClientWidth)
}

const getFocusAppearance = (control: Locator) =>
  control.evaluate((element) => {
    const styles = window.getComputedStyle(element)

    return {
      backgroundColor: styles.backgroundColor,
      borderColor: styles.borderColor,
      boxShadow: styles.boxShadow,
      outlineColor: styles.outlineColor,
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
    }
  })

const expectVisibleKeyboardFocus = async (
  page: Page,
  label: string,
  control: Locator,
) => {
  const blurredAppearance = await getFocusAppearance(control)

  await control.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(control).toBeFocused()
  const transitionTime = await control.evaluate((element) => {
    const styles = window.getComputedStyle(element)
    const toMilliseconds = (value: string) =>
      value.endsWith('ms')
        ? Number.parseFloat(value)
        : Number.parseFloat(value) * 1000
    const durations = styles.transitionDuration.split(',').map(toMilliseconds)
    const delays = styles.transitionDelay.split(',').map(toMilliseconds)

    return Math.max(
      0,
      ...durations.map(
        (duration, index) => duration + (delays[index] ?? delays[0] ?? 0),
      ),
    )
  })
  await page.waitForTimeout(Math.min(transitionTime + 50, 1000))

  const focusedAppearance = await getFocusAppearance(control)
  const hasVisibleOutline =
    focusedAppearance.outlineStyle !== 'none' &&
    Number.parseFloat(focusedAppearance.outlineWidth) > 0

  expect
    .soft(focusedAppearance, `${label} focus appearance`)
    .not.toEqual(blurredAppearance)
  expect.soft(hasVisibleOutline, `${label} visible focus outline`).toBeTruthy()
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

test('dev server supports the local CRUD starter records flow', async ({
  page,
}) => {
  await signInWithDemoAuth(page)
  await expectDashboard(page)

  await expect(page.getByText('Route map')).toBeVisible()
  await page.getByRole('button', { name: 'New record' }).click()

  const dialog = page.getByRole('dialog', { name: 'Create record' })
  await dialog.getByRole('textbox', { name: 'Record' }).fill('Policy checklist')
  await dialog.getByRole('textbox', { name: 'Owner' }).fill('Operations')
  await dialog.getByRole('textbox', { name: 'Status' }).fill('Draft')
  await dialog.getByRole('button', { name: 'Create record' }).click()

  await expect(dialog).toBeHidden()
  await expect(page.getByText('Policy checklist')).toBeVisible()
  await expect(page.getByText('Operations')).toBeVisible()
  await expect(page.getByText('Draft')).toBeVisible()

  await page
    .getByRole('button', { name: 'Open actions for Policy checklist' })
    .click()
  await page.getByRole('menuitem', { name: 'Delete Policy checklist' }).click()

  await expect(page.getByText('Policy checklist')).toBeHidden()
})

for (const viewport of [
  { name: 'mobile', width: 430, height: 932, hasRail: false },
  { name: 'tablet', width: 1024, height: 1366, hasRail: true },
  { name: 'desktop', width: 1600, height: 1000, hasRail: true },
]) {
  test(`renders the adaptive dashboard at ${viewport.name} size`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })
    await signInWithDemoAuth(page, `${viewport.name}@example.com`)
    await expectDashboard(page, viewport.name)
    await expectDashboardFitsViewport(page)
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()

    await expect(page.getByRole('complementary')).toHaveCount(
      viewport.hasRail ? 1 : 0,
    )
    await expect(
      page.getByRole('navigation', { name: 'Mobile dashboard' }),
    ).toHaveCount(viewport.hasRail ? 0 : 1)
  })
}

test('renders readable data grid column headers', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 1366 })
  await signInWithDemoAuth(page, 'header-contrast@example.com')

  for (const name of ['Record', 'Owner', 'Status', 'Updated']) {
    const header = page.getByRole('columnheader', { name })
    await expect(header).toBeVisible()

    const colors = await header.evaluate((element) => {
      const styles = window.getComputedStyle(element)

      return {
        background: styles.backgroundColor,
        foreground: styles.color,
      }
    })

    expect(colors.foreground).not.toBe(colors.background)
  }
})

test('shows visible focus for dashboard keyboard controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 })
  await signInWithDemoAuth(page, 'keyboard-focus@example.com')

  const homeControl = page
    .getByRole('navigation', { name: 'Dashboard sections' })
    .getByRole('button', { name: 'Home' })
  await expectVisibleKeyboardFocus(page, 'rail Home', homeControl)
  expect((await getFocusAppearance(homeControl)).outlineColor).toBe(
    'rgb(255, 255, 255)',
  )

  const notificationsControl = page.getByRole('button', {
    name: 'Notifications',
  })
  await expectVisibleKeyboardFocus(page, 'Notifications', notificationsControl)
  expect((await getFocusAppearance(notificationsControl)).outlineColor).toBe(
    'rgb(49, 87, 255)',
  )

  const searchControl = page.getByRole('searchbox', {
    name: 'Search dashboard',
  })
  const searchContainer = searchControl.locator('xpath=../..')
  const blurredSearchAppearance = await getFocusAppearance(searchContainer)
  await searchControl.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(searchControl).toBeFocused()
  const focusedSearchAppearance = await getFocusAppearance(searchContainer)

  expect(focusedSearchAppearance).not.toEqual(blurredSearchAppearance)
  expect(focusedSearchAppearance.borderColor).toBe('rgb(49, 87, 255)')
  expect(focusedSearchAppearance.boxShadow).not.toBe('none')

  await page.locator('#upload input[type="file"]').setInputFiles({
    name: 'keyboard-focus.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"focus":true}'),
  })

  for (const [label, control] of [
    ['Logout', page.getByRole('button', { name: 'Logout' })],
    ['New record', page.getByRole('button', { name: 'New record' })],
    [
      'record action',
      page.getByRole('button', { name: 'Open actions for Route map' }),
    ],
    ['upload dropzone', page.getByTestId('multi-dropzone')],
    [
      'upload-row remove',
      page.getByRole('button', { name: 'Remove keyboard-focus.json' }),
    ],
  ]) {
    await expectVisibleKeyboardFocus(page, label, control)
  }

  await homeControl.click()
  const pointerAppearance = await getFocusAppearance(homeControl)

  expect(
    pointerAppearance.outlineStyle === 'none' ||
      Number.parseFloat(pointerAppearance.outlineWidth) === 0,
  ).toBeTruthy()
})

test('filters records and navigates dashboard sections locally', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 })
  await signInWithDemoAuth(page)

  const search = page.getByRole('searchbox', { name: 'Search dashboard' })
  await search.fill('platform')
  await expect(page.getByText('Auth loader')).toBeVisible()
  await expect(page.getByText('Route map')).toBeHidden()

  await search.clear()
  await page
    .getByRole('navigation', { name: 'Dashboard sections' })
    .getByRole('button', { name: 'Upload' })
    .click()
  await expect(page.locator('#upload')).toBeInViewport()
})

test('navigates dashboard sections from the mobile bottom navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 430, height: 932 })
  await signInWithDemoAuth(page, 'mobile-navigation@example.com')

  const mobileNavigation = page.getByRole('navigation', {
    name: 'Mobile dashboard',
  })
  await mobileNavigation.getByRole('button', { name: 'Upload' }).click()
  await expect(page.locator('#upload')).toBeInViewport()
})

test('reports unavailable notification controls', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 })
  await signInWithDemoAuth(page)

  await page.getByRole('button', { name: 'Notifications' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Notifications are not configured in this template.',
  )
})

test('reports unavailable profile controls on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 })
  await signInWithDemoAuth(page, 'mobile-profile@example.com')

  const mobileNavigation = page.getByRole('navigation', {
    name: 'Mobile dashboard',
  })
  await mobileNavigation.getByRole('button', { name: 'Profile' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Profile is not configured in this template.',
  )
})
