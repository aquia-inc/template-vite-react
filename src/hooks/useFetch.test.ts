import { renderHook, waitFor } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import useFetch from '@/hooks/useFetch'

describe('useFetch', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('fetches data successfully', async () => {
    const data = { message: 'Test data' }
    fetchMock.mockResponseOnce(JSON.stringify(data))

    const { result, rerender } = renderHook(() => useFetch('https://test.com'))

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    rerender()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual(data)
      expect(result.current.error).toBeNull()
    })
  })

  test('handles fetch error', async () => {
    const errorMessage = 'Fetch error'
    fetchMock.mockRejectOnce(new Error(errorMessage))

    const { result, rerender } = renderHook(() => useFetch('https://test.com'))

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    rerender()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toEqual(new Error(errorMessage))
    })
  })
})
