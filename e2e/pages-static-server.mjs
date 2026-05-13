import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const distDir = resolve('dist')
const hostname = '127.0.0.1'
const port = Number(process.env.PAGES_E2E_PORT ?? 4174)
const basePath = '/template-vite-react/'

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
  const relativePath = decodeURIComponent(requestPath.slice(basePath.length))
  const staticPath = normalize(join(distDir, relativePath))

  if (!staticPath.startsWith(distDir)) {
    return null
  }

  if (existsSync(staticPath) && statSync(staticPath).isFile()) {
    return staticPath
  }

  return join(distDir, 'index.html')
}

createServer((request, response) => {
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
}).listen(port, hostname, () => {
  console.log(`Serving dist at http://${hostname}:${port}${basePath}`)
})
