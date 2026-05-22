import { renderHook, waitFor } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import useFetch from '@/hooks/useFetch'
import { ApiRequestError } from '@/utils/apiRequest'

const jwtToken = 'test-token'

describe('useFetch', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('fetches absolute URLs with the legacy raw fetch behavior', async () => {
    const data = { message: 'Test data' }
    fetchMock.mockResponseOnce(JSON.stringify(data))

    const { result } = renderHook(() =>
      useFetch<typeof data>('https://test.com'),
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(data)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(fetchMock).toHaveBeenCalledWith('https://test.com', {
      signal: expect.any(AbortSignal),
    })
  })

  test('fetches API paths through useApiQuery', async () => {
    const data = { message: 'API data' }
    fetchMock.mockResponseOnce(JSON.stringify(data))

    const { result } = renderHook(() =>
      useFetch<typeof data>('test-endpoint', { jwtToken }),
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(data)
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/v1/test-endpoint'),
      expect.objectContaining({
        headers: { authorization: jwtToken },
      }),
    )
  })

  test('handles absolute URL fetch errors with the legacy error shape', async () => {
    fetchMock.mockRejectOnce(new Error('Fetch error'))

    const { result } = renderHook(() => useFetch('https://test.com'))

    await waitFor(() => {
      expect(result.current.error).toEqual(new Error('Fetch error'))
    })

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  test('handles API path fetch errors through the compatibility wrapper', async () => {
    fetchMock.mockRejectOnce(new Error('Fetch error'))

    const { result } = renderHook(() => useFetch('test-endpoint', { jwtToken }))

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(ApiRequestError)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toMatchObject({
      message: 'Request failed before receiving a response',
      statusText: 'Network Error',
    })
  })
})
