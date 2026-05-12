module.exports = {
  verbose: true,
  resolver: '<rootDir>/config/jest/resolver.cjs',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.(js|jsx|ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/mocks/**',
    '!src/utils/config.ts',
    '!src/utils/runtime.ts',
  ],
  coveragePathIgnorePatterns: [],
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupTests.cjs'],
  testEnvironment: 'jsdom',
  transform: {
    // configure jest to use swc for ts/tsx files
    // see: https://swc.rs/docs/configuring-swc
    '^.+\\.(ts|js|tsx|jsx|mjs|cjs)?$': '@swc/jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.cjs',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
      '<rootDir>/config/jest/fileTransform.cjs',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!(react-router(?:-dom)?|uuid)[/\\\\])',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^aws-amplify$': '<rootDir>/config/__mocks__/aws-amplify.ts',
    '^aws-amplify/auth$': '<rootDir>/config/__mocks__/aws-amplify-auth.ts',
    '^react-router$':
      '<rootDir>/node_modules/react-router/dist/development/index.js',
    '^react-router/dom$':
      '<rootDir>/node_modules/react-router/dist/development/dom-export.js',
    '^react-router-dom$':
      '<rootDir>/node_modules/react-router-dom/dist/index.js',
    '^@/utils/config$': '<rootDir>/config/jest/configMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: [
    // Place tsx and ts to beginning as suggestion from Jest team
    // https://jestjs.io/docs/configuration#modulefileextensions-arraystring
    'tsx',
    'ts',
    'cjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'web.tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  resetMocks: true,
}
