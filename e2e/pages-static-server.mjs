import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'

import { E2E_HOST, readE2EPort } from './port-config.mjs'

const distDir = resolve('dist')
const hostname = E2E_HOST
const port = readE2EPort('E2E_PAGES_PORT')
const normalizeBasePath = (value = '/template-vite-react/') => {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`

  return withLeadingSlash.endsWith('/')
    ? withLeadingSlash
    : `${withLeadingSlash}/`
}
const basePath = normalizeBasePath(process.env.PAGES_E2E_BASE_PATH)
const indexFile = join(distDir, 'index.html')

if (!existsSync(indexFile)) {
  console.error('Missing dist/index.html. Run yarn build before serving Pages.')
  process.exit(1)
}

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
])

const sendFile = (response, filePath) => {
  response.writeHead(200, {
    'Content-Type':
      contentTypes.get(extname(filePath)) ?? 'application/octet-stream',
  })
  createReadStream(filePath).pipe(response)
}

const resolveStaticPath = (requestPath) => {
  let relativePath

  try {
    relativePath = decodeURIComponent(requestPath.slice(basePath.length))
  } catch {
    return null
  }

  const staticPath = resolve(distDir, relativePath)
  const pathFromDist = relative(distDir, staticPath)

  if (pathFromDist.startsWith('..') || isAbsolute(pathFromDist)) {
    return null
  }

  if (existsSync(staticPath) && statSync(staticPath).isFile()) {
    return staticPath
  }

  return join(distDir, 'index.html')
}

const server = createServer((request, response) => {
  const requestUrl = new URL(
    request.url ?? '/',
    `http://${request.headers.host}`,
  )
  const requestPath =
    requestUrl.pathname === basePath.slice(0, -1)
      ? basePath
      : requestUrl.pathname

  if (!requestPath.startsWith(basePath)) {
    response.writeHead(404).end('Not found')
    return
  }

  const staticPath = resolveStaticPath(requestPath)

  if (!staticPath) {
    response.writeHead(403).end('Forbidden')
    return
  }

  sendFile(response, staticPath)
})

let shuttingDown = false
const shutdown = () => {
  if (shuttingDown) return
  shuttingDown = true
  server.close((error) => {
    if (error) {
      console.error(error)
      process.exitCode = 1
    }
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
server.once('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`E2E_PORT_BIND_FAILED:pages:${port}`)
  } else {
    console.error(error)
  }
  process.exitCode = 1
})

server.listen(port, hostname, () => {
  console.log(`Serving dist at http://${hostname}:${port}${basePath}`)
})
