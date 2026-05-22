import fetchMock from 'jest-fetch-mock'
import apiRequest, {
  ApiRequestError,
  isApiRequestAbortError,
} from '@/utils/apiRequest'
import CONFIG from '@/utils/config'
import getJWT from '@/utils/getJWT'

jest.mock('@/utils/getJWT')

const jwtToken = 'test-token'
const path = 'test-endpoint'
const url = new URL(`${CONFIG.API_URL}/v1/${path}`).toString()
const authHeaders = {
  authorization: jwtToken,
}
const jsonHeaders = {
  ...authHeaders,
  'content-type': 'application/json',
}

beforeEach(() => {
  fetchMock.resetMocks()
  jest.mocked(getJWT).mockReset()
  jest.mocked(getJWT).mockResolvedValue(jwtToken)
})

test('parses a successful JSON response body', async () => {
  const response = { id: '1', name: 'First item' }
  fetchMock.mockResponseOnce(JSON.stringify(response))

  await expect(
    apiRequest<typeof response>({ jwtToken, path }),
  ).resolves.toEqual(response)
})

test('makes a GET request with the correct URL and headers', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest({ jwtToken, path })

  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers: authHeaders,
    method: 'GET',
    signal: expect.any(AbortSignal),
  })
})

test('serializes a typed request body', async () => {
  const body = { key: 'value' }
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest<{ ok: boolean }, typeof body>({
    jwtToken,
    path,
    method: 'POST',
    body,
  })

  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: JSON.stringify(body),
    headers: jsonHeaders,
    method: 'POST',
    signal: expect.any(AbortSignal),
  })
})

test('preserves non-JSON request bodies', async () => {
  const body = new URLSearchParams({ key: 'value' })
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest<{ ok: boolean }, URLSearchParams>({
    jwtToken,
    path,
    method: 'POST',
    body,
  })

  expect(fetchMock).toHaveBeenCalledWith(url, {
    body,
    headers: authHeaders,
    method: 'POST',
    signal: expect.any(AbortSignal),
  })
})

test('returns undefined for a 204 response', async () => {
  fetchMock.mockResponseOnce('', { status: 204 })

  await expect(apiRequest<void>({ jwtToken, path })).resolves.toBeUndefined()
})

test('returns undefined for an empty response body', async () => {
  fetchMock.mockResponseOnce('')

  await expect(apiRequest<void>({ jwtToken, path })).resolves.toBeUndefined()
})

test('normalizes HTTP error responses', async () => {
  const body = { error: 'Invalid item' }
  fetchMock.mockResponseOnce(JSON.stringify(body), {
    status: 422,
    statusText: 'Unprocessable Entity',
  })
  const request = apiRequest({ jwtToken, path })

  await expect(request).rejects.toMatchObject({
    status: 422,
    statusText: 'Unprocessable Entity',
    message: 'Invalid item',
    path,
    body,
  })
  await expect(request).rejects.toBeInstanceOf(ApiRequestError)
})

test('uses the first non-empty string from common error response fields', async () => {
  const body = { message: { text: 'ignored' }, error: '', detail: 'Details' }
  fetchMock.mockResponseOnce(JSON.stringify(body), {
    status: 400,
    statusText: 'Bad Request',
  })

  await expect(apiRequest({ jwtToken, path })).rejects.toMatchObject({
    status: 400,
    statusText: 'Bad Request',
    message: 'Details',
    path,
    body,
  })
})

test('normalizes invalid JSON responses', async () => {
  fetchMock.mockResponseOnce('not-json', {
    status: 200,
    statusText: 'OK',
  })

  await expect(apiRequest({ jwtToken, path })).rejects.toMatchObject({
    status: 200,
    statusText: 'OK',
    message: 'Invalid JSON response',
    path,
    body: 'not-json',
  })
})

test('uses the existing JWT helper when no explicit token is provided', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest({ path })

  expect(getJWT).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers: authHeaders,
    method: 'GET',
    signal: expect.any(AbortSignal),
  })
})

test('supports an injected token resolver', async () => {
  const getToken = jest.fn().mockResolvedValue('resolved-token')
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest({ path, getToken })

  expect(getToken).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers: {
      authorization: 'resolved-token',
    },
    method: 'GET',
    signal: expect.any(AbortSignal),
  })
})

test('falls back to the JWT helper when the explicit token is empty', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest({ jwtToken: '', path })

  expect(getJWT).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers: authHeaders,
    method: 'GET',
    signal: expect.any(AbortSignal),
  })
})

test('falls back to the JWT helper when the explicit token is blank', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest({ jwtToken: '   ', path })

  expect(getJWT).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers: authHeaders,
    method: 'GET',
    signal: expect.any(AbortSignal),
  })
})

test('uses a non-empty explicit token before an injected resolver', async () => {
  const getToken = jest.fn().mockResolvedValue('resolved-token')
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest({ jwtToken, path, getToken })

  expect(getToken).not.toHaveBeenCalled()
  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers: authHeaders,
    method: 'GET',
    signal: expect.any(AbortSignal),
  })
})

test('normalizes token resolution errors', async () => {
  jest.mocked(getJWT).mockRejectedValueOnce(new Error('missing token'))

  await expect(apiRequest({ path })).rejects.toMatchObject({
    status: 401,
    statusText: 'Unauthorized',
    message: 'Unable to resolve JWT token',
    path,
  })
})

test('passes the abort signal to fetch', async () => {
  const controller = new AbortController()
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  await apiRequest({ jwtToken, path, signal: controller.signal })

  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers: authHeaders,
    method: 'GET',
    signal: controller.signal,
  })
})

test('normalizes aborted requests', async () => {
  fetchMock.mockRejectOnce(
    Object.assign(new Error('Aborted'), {
      name: 'AbortError',
    }),
  )

  const request = apiRequest({ jwtToken, path })

  await expect(request).rejects.toMatchObject({
    status: 0,
    statusText: 'AbortError',
    message: 'Request aborted',
    path,
  })

  const error = await request.catch((caughtError) => caughtError)
  expect(isApiRequestAbortError(error)).toBe(true)
  expect(error).toMatchObject({ aborted: true })
})

test('normalizes network failures', async () => {
  fetchMock.mockRejectOnce(new Error('offline'))

  await expect(apiRequest({ jwtToken, path })).rejects.toMatchObject({
    status: 0,
    statusText: 'Network Error',
    message: 'Request failed before receiving a response',
    path,
  })
})
