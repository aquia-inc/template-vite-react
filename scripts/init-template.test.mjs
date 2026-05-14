import assert from 'node:assert/strict'
import { mkdtemp, readFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

import { buildTargetIdentity, runInitTemplate } from './init-template.mjs'

const sampleArgs = [
  '--app-name',
  'Example Portal',
  '--package-name',
  'example-portal',
  '--github-org',
  'example-org',
  '--repo-name',
  'example-portal',
  '--org-name',
  'Example Org',
  '--org-url',
  'https://example.com/',
]

const writeFixture = async () => {
  const root = await mkdtemp(join(tmpdir(), 'init-template-'))

  await mkdir(join(root, 'src/utils'), { recursive: true })
  await mkdir(join(root, 'src/views/Home'), { recursive: true })
  await mkdir(join(root, 'src/stories'), { recursive: true })
  await mkdir(join(root, 'src/locales'), { recursive: true })
  await mkdir(join(root, '.github/workflows'), { recursive: true })

  await writeFile(
    join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'template-vite-react',
        description: 'Boilerplate for React + Vite project',
        homepage: 'https://github.com/aquia-inc/template-vite-react#readme',
        bugs: {
          url: 'https://github.com/aquia-inc/template-vite-react/issues',
        },
        author: 'Aquia, Inc.',
        scripts: {},
      },
      null,
      2,
    ),
  )
  await writeFile(
    join(root, 'README.md'),
    [
      '# template-vite-react',
      'git clone git@github.com:aquia-inc/template-vite-react.git',
      'cd template-vite-react',
      'https://aquia-inc.github.io/template-vite-react/',
      'VITE_PUBLIC_BASE_PATH=/template-vite-react/',
      'VITE_CF_DOMAIN=https://aquia-inc.github.io/template-vite-react/',
      'assets under `/template-vite-react/`',
      '',
    ].join('\n'),
  )
  await writeFile(
    join(root, 'src/constants.ts'),
    [
      "export const ORG_NAME = 'Aquia'",
      "export const ORG_URL = 'https://aquia.us/'",
      'export const TEMPLATE_GITHUB_URL =',
      "  'https://github.com/aquia-inc/template-vite-react'",
      '',
    ].join('\n'),
  )
  await writeFile(
    join(root, 'src/utils/demoAuth.ts'),
    "const DEMO_AUTH_STORAGE_KEY = 'template-vite-react:demo-auth-session'\n",
  )
  await writeFile(
    join(root, 'src/utils/demoAuth.test.ts'),
    "window.sessionStorage.getItem('template-vite-react:demo-auth-session')\n",
  )
  await writeFile(
    join(root, 'src/locales/en.ts'),
    "export const PUBLIC_APP_NAME = 'Aquia Vite-React Template'\n",
  )
  await writeFile(
    join(root, 'src/views/Home/Home.tsx'),
    '<Typography>template-vite-react</Typography>\n',
  )
  await writeFile(
    join(root, 'src/stories/Introduction.mdx'),
    '<Meta title="Template/Introduction" />\n\n# template-vite-react\n',
  )
  await writeFile(
    join(root, '.github/workflows/cicd.yaml'),
    [
      "VITE_PUBLIC_BASE_PATH: ${{ github.ref == 'refs/heads/main' && '/template-vite-react/' || '/' }}",
      "VITE_CF_DOMAIN: ${{ github.ref == 'refs/heads/main' && 'https://aquia-inc.github.io/template-vite-react/' || '' }}",
      '',
    ].join('\n'),
  )
  await writeFile(
    join(root, 'playwright.config.ts'),
    "const normalizePagesBasePath = (value = '/template-vite-react/') => value\n",
  )

  return root
}

test('builds derived target identity from required flags', () => {
  assert.deepEqual(
    buildTargetIdentity({
      appName: 'Example Portal',
      packageName: 'example-portal',
      githubOrg: 'example-org',
      repoName: 'example-portal',
      orgName: 'Example Org',
      orgUrl: 'https://example.com/',
    }),
    {
      appName: 'Example Portal',
      packageName: 'example-portal',
      githubOrg: 'example-org',
      repoName: 'example-portal',
      orgName: 'Example Org',
      orgUrl: 'https://example.com/',
      githubUrl: 'https://github.com/example-org/example-portal',
      pagesBasePath: '/example-portal/',
      pagesUrl: 'https://example-org.github.io/example-portal/',
      demoAuthStorageKey: 'example-portal:demo-auth-session',
    },
  )
})

test('falls back to repo name for package name and demo auth storage key', () => {
  const identity = buildTargetIdentity({
    appName: 'Example Portal',
    githubOrg: 'example-org',
    repoName: 'example-portal',
    orgName: 'Example Org',
    orgUrl: 'https://example.com/',
  })

  assert.equal(identity.packageName, 'example-portal')
  assert.equal(identity.demoAuthStorageKey, 'example-portal:demo-auth-session')
})

test('refuses missing required flags with a clear message', async () => {
  const stderr = []
  const result = await runInitTemplate(['--app-name', 'Example Portal'], {
    cwd: await writeFixture(),
    stderr: (message) => stderr.push(message),
  })

  assert.equal(result.exitCode, 1)
  assert.match(stderr.join('\n'), /Missing required flags/)
  assert.match(stderr.join('\n'), /--github-org/)
})

test('prints help without requiring flags', async () => {
  const stdout = []
  const result = await runInitTemplate(['--help'], {
    cwd: await writeFixture(),
    stdout: (message) => stdout.push(message),
  })

  assert.equal(result.exitCode, 0)
  assert.match(stdout.join('\n'), /yarn init:template/)
  assert.match(stdout.join('\n'), /--app-name/)
})

test('dry run reports planned replacements without modifying files', async () => {
  const root = await writeFixture()
  const packagePath = join(root, 'package.json')
  const originalPackage = await readFile(packagePath, 'utf8')
  const stdout = []

  const result = await runInitTemplate(sampleArgs, {
    cwd: root,
    stdout: (message) => stdout.push(message),
  })

  assert.equal(result.exitCode, 0)
  assert.equal(await readFile(packagePath, 'utf8'), originalPackage)
  assert.match(stdout.join('\n'), /DRY RUN/)
  assert.match(stdout.join('\n'), /package.json/)
  assert.match(stdout.join('\n'), /src\/utils\/demoAuth.ts/)
})

test('write mode updates deterministic template identity values', async () => {
  const root = await writeFixture()

  const result = await runInitTemplate([...sampleArgs, '--write'], {
    cwd: root,
  })

  assert.equal(result.exitCode, 0)
  assert.match(
    await readFile(join(root, 'package.json'), 'utf8'),
    /"name": "example-portal"/,
  )
  assert.match(
    await readFile(join(root, 'README.md'), 'utf8'),
    /# Example Portal/,
  )
  assert.match(
    await readFile(join(root, 'src/constants.ts'), 'utf8'),
    /https:\/\/github\.com\/example-org\/example-portal/,
  )
  assert.match(
    await readFile(join(root, 'src/utils/demoAuth.ts'), 'utf8'),
    /example-portal:demo-auth-session/,
  )
  assert.match(
    await readFile(join(root, 'src/locales/en.ts'), 'utf8'),
    /Example Portal/,
  )
  assert.match(
    await readFile(join(root, 'src/views/Home/Home.tsx'), 'utf8'),
    /Example Portal/,
  )
  assert.match(
    await readFile(join(root, 'src/stories/Introduction.mdx'), 'utf8'),
    /Example Portal\/Introduction/,
  )
  assert.match(
    await readFile(join(root, '.github/workflows/cicd.yaml'), 'utf8'),
    /\/example-portal\//,
  )
  assert.match(
    await readFile(join(root, '.github/workflows/cicd.yaml'), 'utf8'),
    /https:\/\/example-org\.github\.io\/example-portal\//,
  )
  assert.match(
    await readFile(join(root, 'playwright.config.ts'), 'utf8'),
    /\/example-portal\//,
  )
})
