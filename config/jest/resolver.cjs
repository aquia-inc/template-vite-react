const fs = require('node:fs')
const path = require('node:path')

module.exports = (request, options) => {
  if (path.isAbsolute(request) && fs.existsSync(request)) {
    return request
  }

  try {
    return require.resolve(request, {
      paths: [options.basedir, options.rootDir].filter(Boolean),
    })
  } catch {
    return options.defaultResolver(request, options)
  }
}
