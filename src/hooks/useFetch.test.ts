import { renderHook, waitFor } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import useFetch from '@/hooks/useFetch'
import { ApiRequestError } from '@/utils/apiRequest'

const jwtToken = 'test-token'

describe('useFetch', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('fetches API data successfully through the compatibility wrapper', async () => {
    const data = { message: 'Test data' }
    fetchMock.mockResponseOnce(JSON.stringify(data))

    const { result } = renderHook(() =>
      useFetch<typeof data>('test-endpoint', { jwtToken }),
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(data)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('handles fetch errors through the compatibility wrapper', async () => {
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
