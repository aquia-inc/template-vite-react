import { createServer } from 'vite'

import { E2E_HOST, readE2EPort } from './port-config.mjs'

const port = readE2EPort('E2E_DEV_PORT')
let server
let shuttingDown = false

const shutdown = async () => {
  if (shuttingDown) return
  shuttingDown = true
  await server?.close()
}

const reportShutdownError = (error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Failed to close Vite development server: ${message}`)
  process.exitCode = 1
}

const shutdownOnSignal = () => {
  void shutdown().catch(reportShutdownError)
}

process.once('SIGINT', shutdownOnSignal)
process.once('SIGTERM', shutdownOnSignal)

try {
  server = await createServer({
    mode: 'test',
    server: {
      host: E2E_HOST,
      port,
      strictPort: true,
    },
  })
  await server.listen()
  server.printUrls()
} catch (error) {
  if (
    error.code === 'EADDRINUSE' ||
    /port .* already in use/i.test(error.message)
  ) {
    console.error(`E2E_PORT_BIND_FAILED:dev:${port}`)
  } else {
    console.error(error)
  }
  await shutdown().catch(reportShutdownError)
  process.exitCode = 1
}
