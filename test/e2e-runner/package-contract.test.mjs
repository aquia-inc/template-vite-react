import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('package scripts route E2E runs through the port runner', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'))

  assert.equal(packageJson.scripts['test:e2e'], 'node e2e/run.mjs')
  assert.equal(
    packageJson.scripts['test:e2e:headed'],
    'node e2e/run.mjs --headed',
  )
  assert.equal(
    packageJson.scripts['test:e2e:runner'],
    'node --test test/e2e-runner/*.test.mjs',
  )
  assert.match(packageJson.scripts.ci, /test:e2e:runner/)
})

test('PR build derives the Pages domain from the selected port', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'))

  assert.match(
    packageJson.scripts['ci:pr:build'],
    /VITE_CF_DOMAIN=http:\/\/127\.0\.0\.1:\$\{E2E_PAGES_PORT:-4174\}/,
  )
})

test('production E2E code no longer references PAGES_E2E_PORT', async () => {
  const sources = await Promise.all(
    [
      'e2e/dev-server.mjs',
      'e2e/pages-static-server.mjs',
      'e2e/port-config.mjs',
      'e2e/run.mjs',
      'playwright.config.ts',
    ].map((path) => readFile(path, 'utf8')),
  )

  assert.doesNotMatch(sources.join('\n'), /(?<!E2E_)PAGES_E2E_PORT/)
})
