import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  utimes,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { gunzipSync } from 'node:zlib'

const archivePath = 'release/template-vite-react.tar.gz'
const archiveName = 'template-vite-react-${nextRelease.gitTag}.tar.gz'

const parseOctal = (buffer) => {
  const value = buffer.toString('ascii').replace(/\0.*$/, '').trim()
  return value === '' ? 0 : Number.parseInt(value, 8)
}

const parseTar = (archive) => {
  const tar = gunzipSync(archive)
  const entries = []

  for (let offset = 0; offset < tar.length; ) {
    const header = tar.subarray(offset, offset + 512)

    if (header.every((byte) => byte === 0)) break

    const name = header.subarray(0, 100).toString('utf8').replace(/\0.*$/, '')
    const prefix = header
      .subarray(345, 500)
      .toString('utf8')
      .replace(/\0.*$/, '')
    const size = parseOctal(header.subarray(124, 136))

    entries.push({
      name: prefix === '' ? name : `${prefix}/${name}`,
      mode: parseOctal(header.subarray(100, 108)),
      uid: parseOctal(header.subarray(108, 116)),
      gid: parseOctal(header.subarray(116, 124)),
      mtime: parseOctal(header.subarray(136, 148)),
      type: header.subarray(156, 157).toString('ascii'),
    })

    offset += 512 + Math.ceil(size / 512) * 512
  }

  return entries
}

test('pins the repaired GitHub release plugin and file assets', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
  const githubPlugin = packageJson.release.plugins.find(
    (plugin) =>
      Array.isArray(plugin) && plugin[0] === '@semantic-release/github',
  )

  assert.equal(
    packageJson.devDependencies['@semantic-release/github'],
    '^12.0.9',
  )
  assert.deepEqual(githubPlugin[1].assets, [
    {
      path: archivePath,
      name: archiveName,
      label: 'Distribution archive',
    },
    {
      path: 'CHANGELOG.md',
      label: 'Changelog',
    },
    {
      path: 'README.md',
      label: 'Readme',
    },
  ])
})

test('queues only the release publisher and builds its archive first', async () => {
  const workflow = await readFile('.github/workflows/cicd.yaml', 'utf8')
  const releaseJob = workflow.match(
    /\n {2}release:\n([\s\S]*?)\n {2}deploy_pages:/,
  )?.[1]

  assert.ok(releaseJob, 'release job must remain in the CI/CD workflow')
  assert.match(
    releaseJob,
    / {4}concurrency:\n {6}group: release-publishing\n {6}queue: max\n/,
  )
  assert.match(
    releaseJob,
    / {6}- name: ARCHIVE - distribution\n {8}run: yarn archive:dist\n/,
  )
  assert.match(
    workflow,
    /concurrency:\n {2}group: \$\{\{ github\.workflow \}\}-\$\{\{ github\.event\.pull_request\.number \|\| github\.run_id \}\}\n {2}cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}/,
  )
})

test('creates a deterministic distribution archive with normalized metadata', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'release-archive-'))
  const dist = path.join(root, 'dist')
  const firstArchive = path.join(root, 'first.tar.gz')
  const secondArchive = path.join(root, 'second.tar.gz')

  try {
    await mkdir(path.join(dist, 'assets'), { recursive: true })
    await writeFile(path.join(dist, 'index.html'), '<main>release</main>\n')
    await writeFile(path.join(dist, 'assets', 'app.js'), 'export default 1\n')

    const { createDistributionArchive } =
      await import('./create-distribution-archive.mjs')

    await createDistributionArchive({
      inputDirectory: dist,
      outputFile: firstArchive,
    })
    await utimes(path.join(dist, 'index.html'), new Date(), new Date())
    await utimes(path.join(dist, 'assets', 'app.js'), new Date(1), new Date(1))
    await createDistributionArchive({
      inputDirectory: dist,
      outputFile: secondArchive,
    })

    const first = await readFile(firstArchive)
    const second = await readFile(secondArchive)
    const digest = (value) => createHash('sha256').update(value).digest('hex')

    assert.equal(digest(first), digest(second))
    assert.deepEqual(parseTar(first), [
      {
        name: 'template-vite-react/',
        mode: 0o755,
        uid: 0,
        gid: 0,
        mtime: 0,
        type: '5',
      },
      {
        name: 'template-vite-react/assets/',
        mode: 0o755,
        uid: 0,
        gid: 0,
        mtime: 0,
        type: '5',
      },
      {
        name: 'template-vite-react/assets/app.js',
        mode: 0o644,
        uid: 0,
        gid: 0,
        mtime: 0,
        type: '0',
      },
      {
        name: 'template-vite-react/index.html',
        mode: 0o644,
        uid: 0,
        gid: 0,
        mtime: 0,
        type: '0',
      },
    ])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
