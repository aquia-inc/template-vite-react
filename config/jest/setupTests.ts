/**
 * @module @cyclone-dx/ui/sbom/utils/setupTests
 */
import { TextDecoder, TextEncoder } from 'node:util'

// global mocks
jest.mock('aws-amplify')
jest.mock('web-vitals')

globalThis.IS_REACT_ACT_ENVIRONMENT = true
window.IS_REACT_ACT_ENVIRONMENT = true

Object.defineProperty(globalThis, 'TextEncoder', {
  configurable: true,
  value: TextEncoder,
})

Object.defineProperty(globalThis, 'TextDecoder', {
  configurable: true,
  value: TextDecoder,
})

// enable mocking of fetch requests
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

import '@testing-library/jest-dom'

if (process.env.NODE_ENV === 'test') {
  // mock environment variables for the global app config during tests
  process.env.VITE_AWS_REGION = 'us-east-1'
  process.env.VITE_CF_DOMAIN = 'https://localhost:3000/'
  process.env.VITE_USER_POOL_ID = 'us-east-1_123456789'
  process.env.VITE_USER_POOL_CLIENT_ID = '1234567890123456789012'
  process.env.VITE_COGNITO_DOMAIN =
    'https://example.auth.us-east-1.amazoncognito.com'
  process.env.VITE_COGNITO_REDIRECT_SIGN_IN = 'https://localhost:3000/sign-in'
  process.env.VITE_COGNITO_REDIRECT_SIGN_OUT = 'https://localhost:3000/sign-out'
  process.env.VITE_IDP_ENABLED = 'false'
}

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
})

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(),
})
