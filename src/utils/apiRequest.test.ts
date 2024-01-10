import fetchMock from 'jest-fetch-mock'
import apiRequest from '@/utils/apiRequest'
import CONFIG from '@/utils/config'

const jwtToken = 'test-token'
const path = 'test-endpoint'
const url = new URL(`${CONFIG.API_URL}/v1/${path}`)
const headers = {
  authorization: jwtToken,
  'content-type': 'application/json',
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('throws an error if no JWT token is provided', async () => {
  await expect(apiRequest({ jwtToken: '', path: 'test' })).rejects.toThrow(
    'No JWT token provided'
  )
})

test('makes a GET request with the correct URL and headers', async () => {
  await apiRequest({ jwtToken, path })
  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: null,
    headers,
    method: 'GET',
    signal: expect.any(AbortSignal),
  })
})

test('makes a POST request with the correct URL, headers, and body', async () => {
  const body = { key: 'value' }
  await apiRequest({ jwtToken, path, method: 'POST', body })
  expect(fetchMock).toHaveBeenCalledWith(url, {
    body: JSON.stringify(body),
    headers,
    method: 'POST',
    signal: expect.any(AbortSignal),
  })
})
