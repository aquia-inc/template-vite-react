import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('Playwright derives every server and project URL from the selected ports', async () => {
  const originalDevPort = process.env.E2E_DEV_PORT
  const originalPagesPort = process.env.E2E_PAGES_PORT
  process.env.E2E_DEV_PORT = '31001'
  process.env.E2E_PAGES_PORT = '31002'

  try {
    const { default: config } = await import(
      `../../playwright.config.ts?test=${Date.now()}`
    )
    const [devServer, pagesServer] = config.webServer
    const [devProject, pagesProject] = config.projects

    assert.equal(devServer.name, 'development server')
    assert.equal(devServer.command, 'node e2e/dev-server.mjs')
    assert.equal(devServer.url, 'http://127.0.0.1:31001')
    assert.equal(devServer.env.E2E_DEV_PORT, '31001')
    assert.equal(devServer.env.E2E_PAGES_PORT, '31002')
    assert.equal(devServer.env.VITE_CF_DOMAIN, 'http://127.0.0.1:31001')
    assert.equal(devServer.reuseExistingServer, false)
    assert.equal(devServer.stderr, 'pipe')
    assert.deepEqual(devServer.gracefulShutdown, {
      signal: 'SIGTERM',
      timeout: 1_000,
    })

    assert.equal(pagesServer.name, 'Pages server')
    assert.equal(pagesServer.url, 'http://127.0.0.1:31002/template-vite-react/')
    assert.equal(pagesServer.env.E2E_DEV_PORT, '31001')
    assert.equal(pagesServer.env.E2E_PAGES_PORT, '31002')
    assert.equal(pagesServer.env.VITE_CF_DOMAIN, 'http://127.0.0.1:31002')
    assert.equal(pagesServer.reuseExistingServer, false)
    assert.equal(pagesServer.stderr, 'pipe')
    assert.deepEqual(pagesServer.gracefulShutdown, {
      signal: 'SIGTERM',
      timeout: 1_000,
    })

    assert.equal(devProject.use.baseURL, 'http://127.0.0.1:31001')
    assert.equal(
      pagesProject.use.baseURL,
      'http://127.0.0.1:31002/template-vite-react/',
    )
  } finally {
    if (originalDevPort === undefined) delete process.env.E2E_DEV_PORT
    else process.env.E2E_DEV_PORT = originalDevPort
    if (originalPagesPort === undefined) delete process.env.E2E_PAGES_PORT
    else process.env.E2E_PAGES_PORT = originalPagesPort
  }
})

test('Playwright config refuses to load without runner-selected ports', () => {
  const script = `import('./playwright.config.ts')`
  const env = { ...process.env }
  delete env.E2E_DEV_PORT
  delete env.E2E_PAGES_PORT

  const result = spawnSync(process.execPath, ['--eval', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env,
  })

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /E2E_DEV_PORT.*must be selected by e2e\/run\.mjs/)
})
