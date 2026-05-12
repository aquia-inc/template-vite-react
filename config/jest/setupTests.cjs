const nodeUtil = require('node:util')
const nodeStreamWeb = require('node:stream/web')

jest.mock('web-vitals')

globalThis.IS_REACT_ACT_ENVIRONMENT = true
window.IS_REACT_ACT_ENVIRONMENT = true

Object.defineProperty(globalThis, 'TextEncoder', {
  configurable: true,
  value: nodeUtil.TextEncoder,
})

Object.defineProperty(globalThis, 'TextDecoder', {
  configurable: true,
  value: nodeUtil.TextDecoder,
})

Object.defineProperty(globalThis, 'ReadableStream', {
  configurable: true,
  value: nodeStreamWeb.ReadableStream,
})

Object.defineProperty(globalThis, 'TransformStream', {
  configurable: true,
  value: nodeStreamWeb.TransformStream,
})

class TestHeaders {
  #headers = new Map()

  constructor(init = {}) {
    if (init instanceof TestHeaders) {
      init.entries().forEach(([key, value]) => this.append(key, value))
      return
    }

    if (typeof init.forEach === 'function') {
      init.forEach((value, key) => this.append(key, value))
      return
    }

    if (typeof init[Symbol.iterator] === 'function') {
      Array.from(init).forEach(([key, value]) => this.append(key, value))
      return
    }

    Object.entries(init).forEach(([key, value]) => this.append(key, value))
  }

  append(key, value) {
    this.#headers.set(key.toLowerCase(), String(value))
  }

  get(key) {
    return this.#headers.get(key.toLowerCase()) ?? null
  }

  has(key) {
    return this.#headers.has(key.toLowerCase())
  }

  set(key, value) {
    this.#headers.set(key.toLowerCase(), String(value))
  }

  entries() {
    return Array.from(this.#headers.entries())
  }
}

class TestRequest {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url
    this.method = init.method ?? input.method ?? 'GET'
    this.headers = new TestHeaders(init.headers ?? input.headers)
    this.signal = init.signal ?? input.signal ?? new AbortController().signal
    this.body = init.body ?? input.body ?? null
  }

  clone() {
    return new TestRequest(this.url, this)
  }
}

class TestResponse {
  constructor(body = null, init = {}) {
    this.body = body
    this.status = init.status ?? 200
    this.statusText = init.statusText ?? ''
    this.ok = this.status >= 200 && this.status < 300
    this.headers = new TestHeaders(init.headers)
  }

  async json() {
    return JSON.parse(this.body)
  }

  async text() {
    return String(this.body ?? '')
  }
}

if (typeof globalThis.Response === 'undefined') {
  Object.defineProperty(globalThis, 'Response', {
    configurable: true,
    value: TestResponse,
  })
}

if (typeof globalThis.Headers === 'undefined') {
  Object.defineProperty(globalThis, 'Headers', {
    configurable: true,
    value: TestHeaders,
  })
}

if (typeof globalThis.Request === 'undefined') {
  Object.defineProperty(globalThis, 'Request', {
    configurable: true,
    value: TestRequest,
  })
}

const { enableFetchMocks } = require('jest-fetch-mock')
enableFetchMocks()

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

require('@testing-library/jest-dom')
