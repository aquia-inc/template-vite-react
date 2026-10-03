import { expect, test as base, type Page } from '@playwright/test'

const test = base.extend<{ browserHealth: void }>({
  browserHealth: [
    async ({ baseURL, page }, use) => {
      const errors: string[] = []
      const origin = new URL(baseURL ?? 'http://127.0.0.1/').origin
      const assetTypes = new Set(['script', 'stylesheet', 'font', 'image'])

      page.on('pageerror', (error) =>
        errors.push(`Page error: ${error.message}`),
      )
      page.on('console', (message) => {
        if (message.type() === 'error')
          errors.push(`Console error: ${message.text()}`)
      })
      page.on('requestfailed', (request) => {
        // Reloads and route changes can cancel an asset that is still loading.
        if (request.failure()?.errorText === 'net::ERR_ABORTED') return
        if (
          new URL(request.url()).origin === origin &&
          assetTypes.has(request.resourceType())
        ) {
          errors.push(
            `Asset request failed: ${request.url()} (${request.failure()?.errorText})`,
          )
        }
      })
      page.on('response', (response) => {
        if (
          new URL(response.url()).origin === origin &&
          assetTypes.has(response.request().resourceType()) &&
          response.status() >= 400
        ) {
          errors.push(`Asset returned ${response.status()}: ${response.url()}`)
        }
      })

      await use()

      expect(errors, errors.join('\n')).toEqual([])
    },
    { auto: true },
  ],
})

test.use({ reducedMotion: 'reduce' })

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

const expectRoute = async (
  page: Page,
  baseURL: string | undefined,
  path: string,
) => {
  await expect(page).toHaveURL(
    new RegExp(`${escapeRegExp(pagesUrl(baseURL, path))}$`),
  )
}

const signInWithDemoAuth = async (page: Page, email = demoEmail) => {
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password', { exact: true }).fill(demoPassword)
  await page.getByRole('button', { name: 'Sign In', exact: true }).click()
}

const expectDashboard = async (
  page: Page,
  baseURL: string | undefined,
  username = 'pages',
) => {
  await expectRoute(page, baseURL, '/app')
  await expect(page.getByTestId('appbar-title')).toHaveText('Dashboard')
  await expect(
    page.getByRole('heading', {
      name: new RegExp(`Welcome User\\s+${username}`, 'i'),
    }),
  ).toBeVisible()
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
  await page.goto(pagesUrl(baseURL, '/app'))

  await expectRoute(page, baseURL, '/auth/login')
  await expect(page.locator('#login-form')).toBeVisible()

  await signInWithDemoAuth(page)
  await expectDashboard(page, baseURL)
})

for (const viewport of [
  { name: 'desktop', width: 1600, height: 1000, mobile: false },
  { name: 'mobile', width: 430, height: 932, mobile: true },
]) {
  test(`pages build validates the complete demo workflow on ${viewport.name}`, async ({
    baseURL,
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })
    await page.goto(pagesUrl(baseURL, '/app'))
    await expectRoute(page, baseURL, '/auth/login')

    const email = page.getByLabel('Email', { exact: true })
    const password = page.getByLabel('Password', { exact: true })
    await email.fill('invalid-email')
    await password.fill('short')
    await password.press('Tab')
    await expect(
      page.getByText('Invalid email format', { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('Password must be at least 8 characters', { exact: true }),
    ).toBeVisible()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(password).toHaveAttribute('aria-invalid', 'true')
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expectRoute(page, baseURL, '/auth/login')
    await expect(page.getByTestId('app')).toHaveCount(0)

    await page
      .getByRole('button', { name: 'Show password', exact: true })
      .click()
    await expect(password).toHaveAttribute('type', 'text')
    await page
      .getByRole('button', { name: 'Hide password', exact: true })
      .click()
    await expect(password).toHaveAttribute('type', 'password')

    const username = `pages-${viewport.name}`
    await signInWithDemoAuth(page, `${username}@example.com`)
    await expectDashboard(page, baseURL, username)
    await page.reload()
    await expectDashboard(page, baseURL, username)

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth)

    const navigation = page.getByRole('navigation', {
      name: viewport.mobile ? 'Mobile dashboard' : 'Dashboard sections',
    })
    await expect(navigation).toBeVisible()
    await expect(page.getByRole('complementary')).toHaveCount(
      viewport.mobile ? 0 : 1,
    )
    await navigation
      .getByRole('button', { name: 'Records', exact: true })
      .click()
    await expect(
      page.getByRole('region', { name: 'Example records', exact: true }),
    ).toBeInViewport()

    const records = page.getByRole('region', {
      name: 'Example records',
      exact: true,
    })
    await expect(records.getByText('Route map', { exact: true })).toBeVisible()
    if (!viewport.mobile) {
      const search = page.getByRole('searchbox', { name: 'Search dashboard' })
      await search.fill('platform')
      await expect(
        records.getByText('Auth loader', { exact: true }),
      ).toBeVisible()
      await expect(records.getByText('Route map', { exact: true })).toBeHidden()
      await search.fill('no matching production record')
      await expect(records.getByRole('status')).toHaveText(
        'No records match “no matching production record”.',
      )
      await search.clear()
      await expect(
        records.getByText('Route map', { exact: true }),
      ).toBeVisible()
    } else {
      await expect(
        page.getByRole('searchbox', { name: 'Search dashboard' }),
      ).toHaveCount(0)
    }

    await page.getByRole('button', { name: 'New record', exact: true }).click()
    let dialog = page.getByRole('dialog', {
      name: 'Create record',
      exact: true,
    })
    let recordName = dialog.getByRole('textbox', { name: /^Record/ })
    let owner = dialog.getByRole('textbox', { name: /^Owner/ })
    const submit = dialog.getByRole('button', {
      name: 'Create record',
      exact: true,
    })
    await expect(submit).toBeDisabled()
    await recordName.focus()
    await owner.focus()
    await expect(
      dialog.getByText('This field is required', { exact: true }).first(),
    ).toBeVisible()
    await expect(submit).toBeDisabled()
    await recordName.fill('Cancelled record')
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
    await expect(dialog).toBeHidden()

    await page.getByRole('button', { name: 'New record', exact: true }).click()
    dialog = page.getByRole('dialog', { name: 'Create record', exact: true })
    recordName = dialog.getByRole('textbox', { name: /^Record/ })
    owner = dialog.getByRole('textbox', { name: /^Owner/ })
    await expect(recordName).toHaveValue('')
    const createdName = `Production ${viewport.name} record`
    await recordName.fill(createdName)
    await expect(
      dialog.getByRole('button', { name: 'Create record', exact: true }),
    ).toBeDisabled()
    await owner.fill('Validation')
    await dialog.getByRole('textbox', { name: /^Status/ }).fill('Draft')
    await expect(
      dialog.getByRole('button', { name: 'Create record', exact: true }),
    ).toBeEnabled()
    await dialog
      .getByRole('button', { name: 'Create record', exact: true })
      .click()
    await expect(dialog).toBeHidden()
    await expect(records.getByText(createdName, { exact: true })).toBeVisible()
    await expect(records.getByText('4 records', { exact: true })).toBeVisible()
    await records
      .getByRole('button', {
        name: `Open actions for ${createdName}`,
        exact: true,
      })
      .click()
    await page
      .getByRole('menuitem', { name: `Delete ${createdName}`, exact: true })
      .click()
    await expect(records.getByText(createdName, { exact: true })).toBeHidden()
    await expect(records.getByText('3 records', { exact: true })).toBeVisible()

    await navigation
      .getByRole('button', { name: 'Upload', exact: true })
      .click()
    const upload = page.getByRole('region', {
      name: 'Upload intake',
      exact: true,
    })
    await expect(upload).toBeInViewport()
    const fileInput = upload.getByLabel('Drag and Drop File Selection', {
      exact: true,
    })
    const jsonName = `production-${viewport.name}.json`
    const csvName = `production-${viewport.name}.csv`
    await fileInput.setInputFiles([
      {
        name: jsonName,
        mimeType: 'application/json',
        buffer: Buffer.from('{"validated":true}'),
      },
      {
        name: csvName,
        mimeType: 'text/csv',
        buffer: Buffer.from('name,status\nExample,Ready\n'),
      },
    ])
    await expect(upload.getByText(jsonName, { exact: true })).toBeVisible()
    await expect(upload.getByText(csvName, { exact: true })).toBeVisible()
    await upload
      .getByRole('button', { name: `Remove ${jsonName}`, exact: true })
      .click()
    await expect(upload.getByText(jsonName, { exact: true })).toBeHidden()
    await expect(upload.getByText(csvName, { exact: true })).toBeVisible()
    await fileInput.setInputFiles({
      name: 'unsupported.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Unsupported upload'),
    })
    await expect(
      upload.getByText(
        'Only the following file types are accepted: JSON, CSV.',
        { exact: true },
      ),
    ).toBeVisible()
    await expect(
      upload.getByText('unsupported.txt', { exact: true }),
    ).toHaveCount(0)
    await upload
      .getByRole('button', { name: `Remove ${csvName}`, exact: true })
      .click()
    await expect(upload.getByText(csvName, { exact: true })).toBeHidden()

    await page.getByRole('button', { name: 'Logout', exact: true }).click()
    await expectRoute(page, baseURL, '/auth/login')
    await page.goto(pagesUrl(baseURL, '/app'))
    await expectRoute(page, baseURL, '/auth/login')
    await page.reload()
    await expectRoute(page, baseURL, '/auth/login')
    await expect(page.locator('#login-form')).toBeVisible()
    await expect(page.getByTestId('app')).toHaveCount(0)
  })
}
