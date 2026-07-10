import { createHash } from 'node:crypto'
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const BLOCK_SIZE = 512
const DEFAULT_INPUT_DIRECTORY = 'dist'
const DEFAULT_OUTPUT_FILE = 'release/template-vite-react.tar.gz'
const DEFAULT_PREFIX = 'template-vite-react'

const writeString = (header, offset, length, value) => {
  const encoded = Buffer.from(value)

  if (encoded.length > length) {
    throw new Error(`Tar header value is too long: ${value}`)
  }

  encoded.copy(header, offset)
}

const writeOctal = (header, offset, length, value) => {
  writeString(
    header,
    offset,
    length,
    `${value.toString(8).padStart(length - 1, '0')}\0`,
  )
}

const splitTarPath = (entryPath) => {
  if (Buffer.byteLength(entryPath) <= 100) {
    return { name: entryPath, prefix: '' }
  }

  for (let index = entryPath.lastIndexOf('/'); index > 0; ) {
    const prefix = entryPath.slice(0, index)
    const name = entryPath.slice(index + 1)

    if (Buffer.byteLength(prefix) <= 155 && Buffer.byteLength(name) <= 100) {
      return { name, prefix }
    }

    index = entryPath.lastIndexOf('/', index - 1)
  }

  throw new Error(`Tar entry path is too long: ${entryPath}`)
}

const createHeader = ({ entryPath, size = 0, type }) => {
  const header = Buffer.alloc(BLOCK_SIZE)
  const { name, prefix } = splitTarPath(entryPath)

  writeString(header, 0, 100, name)
  writeOctal(header, 100, 8, type === '5' ? 0o755 : 0o644)
  writeOctal(header, 108, 8, 0)
  writeOctal(header, 116, 8, 0)
  writeOctal(header, 124, 12, size)
  writeOctal(header, 136, 12, 0)
  header.fill(0x20, 148, 156)
  writeString(header, 156, 1, type)
  writeString(header, 257, 6, 'ustar\0')
  writeString(header, 263, 2, '00')
  writeString(header, 345, 155, prefix)

  const checksum = header.reduce((sum, byte) => sum + byte, 0)
  writeString(header, 148, 8, `${checksum.toString(8).padStart(6, '0')}\0 `)

  return header
}

const collectEntries = async (directory, relativePath = '') => {
  const directoryEntries = await readdir(directory, { withFileTypes: true })
  const entries = []

  for (const directoryEntry of directoryEntries.sort((left, right) =>
    left.name.localeCompare(right.name, 'en'),
  )) {
    const absolutePath = path.join(directory, directoryEntry.name)
    const archivePath = path.posix.join(relativePath, directoryEntry.name)
    const stats = await lstat(absolutePath)

    if (stats.isDirectory()) {
      entries.push({ archivePath: `${archivePath}/`, type: '5' })
      entries.push(...(await collectEntries(absolutePath, archivePath)))
      continue
    }

    if (!stats.isFile()) {
      throw new Error(
        `Distribution contains an unsupported entry: ${absolutePath}`,
      )
    }

    entries.push({ absolutePath, archivePath, size: stats.size, type: '0' })
  }

  return entries
}

export const createDistributionArchive = async ({
  inputDirectory = DEFAULT_INPUT_DIRECTORY,
  outputFile = DEFAULT_OUTPUT_FILE,
  prefix = DEFAULT_PREFIX,
} = {}) => {
  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '')

  if (normalizedPrefix === '') {
    throw new Error('Archive prefix must not be empty')
  }

  const entries = await collectEntries(inputDirectory)
  const chunks = [
    createHeader({ entryPath: `${normalizedPrefix}/`, type: '5' }),
  ]

  for (const entry of entries) {
    const entryPath = `${normalizedPrefix}/${entry.archivePath}`
    chunks.push(createHeader({ ...entry, entryPath }))

    if (entry.type === '0') {
      const contents = await readFile(entry.absolutePath)
      chunks.push(contents)

      const padding = (BLOCK_SIZE - (contents.length % BLOCK_SIZE)) % BLOCK_SIZE
      if (padding > 0) chunks.push(Buffer.alloc(padding))
    }
  }

  chunks.push(Buffer.alloc(BLOCK_SIZE * 2))

  const archive = gzipSync(Buffer.concat(chunks), { level: 9, mtime: 0 })
  archive[9] = 0xff

  await mkdir(path.dirname(outputFile), { recursive: true })
  await writeFile(outputFile, archive)

  return {
    outputFile,
    sha256: createHash('sha256').update(archive).digest('hex'),
  }
}

const isCommandLine =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isCommandLine) {
  try {
    const result = await createDistributionArchive()
    process.stdout.write(`${result.outputFile}  ${result.sha256}\n`)
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`)
    process.exitCode = 1
  }
}
