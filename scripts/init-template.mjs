import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const CURRENT = {
  appName: 'template-vite-react',
  description: 'Boilerplate for React + Vite project',
  githubOrg: 'aquia-inc',
  githubUrl: 'https://github.com/aquia-inc/template-vite-react',
  orgName: 'Aquia',
  orgUrl: 'https://aquia.us/',
  packageAuthor: 'Aquia, Inc.',
  packageName: 'template-vite-react',
  pagesBasePath: '/template-vite-react/',
  pagesUrl: 'https://aquia-inc.github.io/template-vite-react/',
  publicAppName: 'Vite-React App',
  storybookTitle: 'Template/Introduction',
  storageKey: 'template-vite-react:demo-auth-session',
}

const REQUIRED_FLAGS = ['appName', 'githubOrg', 'repoName', 'orgName', 'orgUrl']

const FLAG_NAMES = new Map([
  ['--app-name', 'appName'],
  ['--package-name', 'packageName'],
  ['--github-org', 'githubOrg'],
  ['--repo-name', 'repoName'],
  ['--org-name', 'orgName'],
  ['--org-url', 'orgUrl'],
])

const usage = `Usage:
  yarn init:template --app-name "Example Portal" --package-name example-portal --github-org example-org --repo-name example-portal --org-name "Example Org" --org-url https://example.com/ [--write]

Required flags:
  --app-name      Human-visible application name
  --github-org    GitHub organization or user that owns the repository
  --repo-name     GitHub repository name
  --org-name      Human-visible organization name
  --org-url       Organization website URL

Optional flags:
  --package-name  package.json name; defaults to --repo-name
  --write         Apply replacements. Omit for dry-run mode.
  --help          Show this help text.
`

const toCamelFlag = (name) =>
  `--${name.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)}`

const normalizePagesBasePath = (repoName) =>
  `/${repoName.replace(/^\/+|\/+$/g, '')}/`

const replaceAll = (value, search, replacement) => {
  const count = value.split(search).length - 1

  return {
    count,
    value: value.replaceAll(search, replacement),
  }
}

const applyTextReplacements = (content, replacements) => {
  let nextContent = content
  const applied = []

  for (const replacement of replacements) {
    const result = replaceAll(
      nextContent,
      replacement.search,
      replacement.replacement,
    )

    nextContent = result.value

    if (result.count > 0) {
      applied.push({
        label: replacement.label,
        count: result.count,
      })
    }
  }

  return {
    applied,
    content: nextContent,
  }
}

const parseArgs = (argv) => {
  const options = {
    write: false,
  }
  const errors = []

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help') {
      options.help = true
      continue
    }

    if (arg === '--write') {
      options.write = true
      continue
    }

    const optionName = FLAG_NAMES.get(arg)

    if (!optionName) {
      errors.push(`Unknown flag: ${arg}`)
      continue
    }

    const value = argv[index + 1]

    if (!value || value.startsWith('--')) {
      errors.push(`Missing value for ${arg}`)
      continue
    }

    options[optionName] = value
    index += 1
  }

  return {
    errors,
    options,
  }
}

export const buildTargetIdentity = (options) => {
  const packageName = options.packageName ?? options.repoName
  const pagesBasePath = normalizePagesBasePath(options.repoName)
  const githubUrl = `https://github.com/${options.githubOrg}/${options.repoName}`

  return {
    appName: options.appName,
    packageName,
    githubOrg: options.githubOrg,
    repoName: options.repoName,
    orgName: options.orgName,
    orgUrl: options.orgUrl,
    githubUrl,
    pagesBasePath,
    pagesUrl: `https://${options.githubOrg}.github.io/${options.repoName}/`,
    demoAuthStorageKey: `${packageName}:demo-auth-session`,
  }
}

const getTextReplacementSpecs = (target) => [
  {
    path: 'README.md',
    replacements: [
      {
        label: 'README title',
        search: `# ${CURRENT.appName}`,
        replacement: `# ${target.appName}`,
      },
      {
        label: 'README clone URL',
        search: `git clone git@github.com:${CURRENT.githubOrg}/${CURRENT.appName}.git`,
        replacement: `git clone git@github.com:${target.githubOrg}/${target.repoName}.git`,
      },
      {
        label: 'README checkout directory',
        search: `cd ${CURRENT.appName}`,
        replacement: `cd ${target.repoName}`,
      },
      {
        label: 'README Pages URL',
        search: CURRENT.pagesUrl,
        replacement: target.pagesUrl,
      },
      {
        label: 'README Pages base path',
        search: `VITE_PUBLIC_BASE_PATH=${CURRENT.pagesBasePath}`,
        replacement: `VITE_PUBLIC_BASE_PATH=${target.pagesBasePath}`,
      },
      {
        label: 'README Pages domain',
        search: `VITE_CF_DOMAIN=${CURRENT.pagesUrl}`,
        replacement: `VITE_CF_DOMAIN=${target.pagesUrl}`,
      },
      {
        label: 'README asset base path',
        search: `\`${CURRENT.pagesBasePath}\``,
        replacement: `\`${target.pagesBasePath}\``,
      },
    ],
  },
  {
    path: 'src/constants.ts',
    replacements: [
      {
        label: 'organization name constant',
        search: `export const ORG_NAME = '${CURRENT.orgName}'`,
        replacement: `export const ORG_NAME = '${target.orgName}'`,
      },
      {
        label: 'organization URL constant',
        search: `export const ORG_URL = '${CURRENT.orgUrl}'`,
        replacement: `export const ORG_URL = '${target.orgUrl}'`,
      },
      {
        label: 'template GitHub URL constant',
        search: CURRENT.githubUrl,
        replacement: target.githubUrl,
      },
    ],
  },
  {
    path: 'src/utils/demoAuth.ts',
    replacements: [
      {
        label: 'demo auth storage key',
        search: CURRENT.storageKey,
        replacement: target.demoAuthStorageKey,
      },
    ],
  },
  {
    path: 'src/utils/demoAuth.test.ts',
    replacements: [
      {
        label: 'demo auth test storage key',
        search: CURRENT.storageKey,
        replacement: target.demoAuthStorageKey,
      },
    ],
  },
  {
    path: 'src/locales/en.ts',
    replacements: [
      {
        label: 'public app name',
        search: `export const PUBLIC_APP_NAME = '${CURRENT.publicAppName}'`,
        replacement: `export const PUBLIC_APP_NAME = '${target.appName}'`,
      },
    ],
  },
  {
    path: 'src/views/Home/Home.tsx',
    replacements: [
      {
        label: 'home visible template name',
        search: CURRENT.appName,
        replacement: target.appName,
      },
    ],
  },
  {
    path: 'src/stories/Introduction.mdx',
    replacements: [
      {
        label: 'Storybook introduction title',
        search: CURRENT.storybookTitle,
        replacement: `${target.appName}/Introduction`,
      },
      {
        label: 'Storybook introduction heading',
        search: `# ${CURRENT.appName}`,
        replacement: `# ${target.appName}`,
      },
    ],
  },
  {
    path: '.github/workflows/cicd.yaml',
    replacements: [
      {
        label: 'workflow Pages URL',
        search: CURRENT.pagesUrl,
        replacement: target.pagesUrl,
      },
      {
        label: 'workflow Pages base path',
        search: CURRENT.pagesBasePath,
        replacement: target.pagesBasePath,
      },
    ],
  },
  {
    path: 'playwright.config.ts',
    replacements: [
      {
        label: 'Playwright Pages default base path',
        search: CURRENT.pagesBasePath,
        replacement: target.pagesBasePath,
      },
    ],
  },
  {
    path: 'src/utils/publicBasePath.test.ts',
    replacements: [
      {
        label: 'public base path test values',
        search: CURRENT.appName,
        replacement: target.repoName,
      },
    ],
  },
]

const updatePackageJson = (content, target) => {
  const packageJson = JSON.parse(content)
  const applied = []
  const setIfCurrent = (key, currentValue, nextValue) => {
    if (packageJson[key] === currentValue) {
      packageJson[key] = nextValue
      applied.push({ label: `package ${key}`, count: 1 })
    }
  }

  setIfCurrent('name', CURRENT.packageName, target.packageName)
  setIfCurrent(
    'description',
    CURRENT.description,
    `${target.appName} React application`,
  )
  setIfCurrent(
    'homepage',
    `${CURRENT.githubUrl}#readme`,
    `${target.githubUrl}#readme`,
  )
  setIfCurrent('author', CURRENT.packageAuthor, target.orgName)

  if (packageJson.bugs?.url === `${CURRENT.githubUrl}/issues`) {
    packageJson.bugs.url = `${target.githubUrl}/issues`
    applied.push({ label: 'package bugs URL', count: 1 })
  }

  return {
    applied,
    content: `${JSON.stringify(packageJson, null, 2)}\n`,
  }
}

const createPlanEntry = async (root, spec, target) => {
  const filePath = join(root, spec.path)

  if (!existsSync(filePath)) {
    return {
      applied: [],
      missing: true,
      path: spec.path,
    }
  }

  const content = await readFile(filePath, 'utf8')
  const result =
    spec.path === 'package.json'
      ? updatePackageJson(content, target)
      : applyTextReplacements(content, spec.replacements)

  return {
    applied: result.applied,
    content: result.content,
    changed: result.content !== content,
    path: spec.path,
  }
}

export const createReplacementPlan = async (root, target) => {
  const specs = [
    {
      path: 'package.json',
    },
    ...getTextReplacementSpecs(target),
  ]
  const entries = []

  for (const spec of specs) {
    entries.push(await createPlanEntry(root, spec, target))
  }

  return entries
}

const formatPlan = (plan, write) => {
  const changedEntries = plan.filter((entry) => entry.changed)
  const skippedEntries = plan.filter((entry) => entry.missing)
  const lines = [
    write
      ? 'WRITE MODE: applying template identity replacements.'
      : 'DRY RUN: no files changed.',
  ]

  if (changedEntries.length === 0) {
    lines.push('- No matching template identity values found.')
  }

  for (const entry of changedEntries) {
    const count = entry.applied.reduce((total, item) => total + item.count, 0)
    lines.push(`- ${entry.path}: ${count} replacement(s)`)
  }

  for (const entry of skippedEntries) {
    lines.push(`- ${entry.path}: skipped; file not present`)
  }

  return lines.join('\n')
}

const validateRequiredFlags = (options) =>
  REQUIRED_FLAGS.filter((flagName) => !options[flagName])

export const runInitTemplate = async (
  argv,
  {
    cwd = process.cwd(),
    stdout = (message) => console.log(message),
    stderr = (message) => console.error(message),
  } = {},
) => {
  const { errors, options } = parseArgs(argv)

  if (options.help) {
    stdout(usage)
    return { exitCode: 0 }
  }

  const missingFlags = validateRequiredFlags(options)

  if (errors.length > 0 || missingFlags.length > 0) {
    const messages = [...errors]

    if (missingFlags.length > 0) {
      messages.push(
        `Missing required flags: ${missingFlags.map(toCamelFlag).join(', ')}`,
      )
    }

    stderr(`${messages.join('\n')}\n\n${usage}`)
    return { exitCode: 1 }
  }

  const target = buildTargetIdentity(options)
  const plan = await createReplacementPlan(cwd, target)

  if (options.write) {
    for (const entry of plan) {
      if (entry.changed) {
        await writeFile(join(cwd, entry.path), entry.content)
      }
    }
  }

  stdout(formatPlan(plan, options.write))
  return { exitCode: 0, plan, target }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await runInitTemplate(process.argv.slice(2))
  process.exitCode = result.exitCode
}
