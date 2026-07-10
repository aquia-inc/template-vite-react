import { createServer } from 'node:net'

export const E2E_HOST = '127.0.0.1'
export const E2E_PORT_DEFAULTS = { dev: 4173, pages: 4174 }

const roleConfig = {
  dev: { envName: 'E2E_DEV_PORT' },
  pages: { envName: 'E2E_PAGES_PORT' },
}

const closeServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve()
    })
  })

const parsePort = (envName, value) => {
  if (!/^[0-9]+$/.test(value ?? '')) {
    throw new Error(
      `${envName} received ${JSON.stringify(value)}; set it to a decimal integer from 1 through 65535.`,
    )
  }

  const port = Number(value)
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `${envName} received ${JSON.stringify(value)}; set it to a decimal integer from 1 through 65535.`,
    )
  }

  return port
}

export const readE2EPort = (envName, env = process.env) => {
  if (!Object.hasOwn(env, envName)) {
    throw new Error(
      `${envName} must be selected by e2e/run.mjs; start E2E tests with yarn test:e2e or yarn test:e2e:headed.`,
    )
  }

  return parsePort(envName, env[envName])
}

export const readE2EPorts = (env = process.env) => {
  const dev = readE2EPort('E2E_DEV_PORT', env)
  const pages = readE2EPort('E2E_PAGES_PORT', env)

  if (dev === pages) {
    throw new Error(
      `E2E_DEV_PORT and E2E_PAGES_PORT both selected ${dev}; choose different ports.`,
    )
  }

  return { dev, pages }
}

const describeListenError = ({ error, port, role, source }) => {
  const { envName } = roleConfig[role]
  const received = JSON.stringify(String(port))

  if (error.code === 'EADDRINUSE') {
    return new Error(
      `${envName} received ${received}, but port ${port} is already in use on ${E2E_HOST}; stop the conflicting process or choose another port.`,
      { cause: error },
    )
  }

  if (error.code === 'EACCES') {
    return new Error(
      `${envName} received ${received}, but port ${port} is not accessible on ${E2E_HOST}; choose another port.`,
      { cause: error },
    )
  }

  const action =
    source === 'dynamic'
      ? 'retry the E2E run'
      : `choose another value for ${envName}`
  return new Error(
    `${envName} received ${received}, but port ${port} could not be reserved on ${E2E_HOST} (${error.code ?? error.message}); ${action}.`,
    { cause: error },
  )
}

const listen = ({ port, role, source }) =>
  new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', (error) => {
      reject(describeListenError({ error, port, role, source }))
    })
    server.listen(port, E2E_HOST, () => resolve(server))
  })

const reserveSelection = async (selection, excludePorts) => {
  while (true) {
    const requestedPort = selection.source === 'dynamic' ? 0 : selection.port
    const server = await listen({ ...selection, port: requestedPort })
    const { port } = server.address()

    if (excludePorts.has(port)) {
      await closeServer(server)
      continue
    }

    return {
      selection: { ...selection, port },
      server,
    }
  }
}

const selectPort = ({ defaults, env, role }) => {
  const { envName } = roleConfig[role]

  if (Object.hasOwn(env, envName)) {
    return {
      envName,
      port: parsePort(envName, env[envName]),
      role,
      source: 'explicit',
    }
  }

  if (env.CI === 'true') {
    return {
      envName,
      port: parsePort(envName, String(defaults[role])),
      role,
      source: 'ci-default',
    }
  }

  return { envName, port: 0, role, source: 'dynamic' }
}

export const reserveE2EPorts = async ({
  defaults = E2E_PORT_DEFAULTS,
  env = process.env,
  excludePorts = new Set(),
} = {}) => {
  const selections = [
    selectPort({ defaults, env, role: 'dev' }),
    selectPort({ defaults, env, role: 'pages' }),
  ]

  if (selections[0].port !== 0 && selections[0].port === selections[1].port) {
    throw new Error(
      `E2E_DEV_PORT and E2E_PAGES_PORT both selected ${selections[0].port}; choose different ports.`,
    )
  }

  const settled = await Promise.allSettled(
    selections.map((selection) => reserveSelection(selection, excludePorts)),
  )
  const fulfilled = settled
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)

  if (settled.some((result) => result.status === 'rejected')) {
    await Promise.all(fulfilled.map(({ server }) => closeServer(server)))
    throw settled.find((result) => result.status === 'rejected').reason
  }

  const [devReservation, pagesReservation] = fulfilled
  let released = false

  return {
    dev: devReservation.selection,
    pages: pagesReservation.selection,
    release: async () => {
      if (released) return
      released = true
      await Promise.all(fulfilled.map(({ server }) => closeServer(server)))
    },
  }
}
