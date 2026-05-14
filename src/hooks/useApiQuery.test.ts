import { renderHook, waitFor, act } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import useApiQuery from '@/hooks/useApiQuery'
import { ApiRequestError } from '@/utils/apiRequest'

const jwtToken = 'test-token'

beforeEach(() => {
  fetchMock.resetMocks()
})

test('fetches typed data for an API path', async () => {
  const data = { items: [{ id: '1', name: 'First item' }] }
  fetchMock.mockResponseOnce(JSON.stringify(data))

  const { result } = renderHook(() =>
    useApiQuery<typeof data>('items', { jwtToken }),
  )

  await waitFor(() => {
    expect(result.current.data).toEqual(data)
  })

  expect(result.current.error).toBeNull()
  expect(result.current.loading).toBe(false)
})

test('does not fetch while disabled', () => {
  const { result } = renderHook(() =>
    useApiQuery('items', { enabled: false, jwtToken }),
  )

  expect(result.current.data).toBeNull()
  expect(result.current.loading).toBe(false)
  expect(fetchMock).not.toHaveBeenCalled()
})

test('stores normalized API errors', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ message: 'Nope' }), {
    status: 500,
    statusText: 'Server Error',
  })

  const { result } = renderHook(() => useApiQuery('items', { jwtToken }))

  await waitFor(() => {
    expect(result.current.error).toBeInstanceOf(ApiRequestError)
  })

  expect(result.current.error).toMatchObject({
    message: 'Nope',
    status: 500,
  })
  expect(result.current.loading).toBe(false)
})

test('refetches the query', async () => {
  fetchMock
    .mockResponseOnce(JSON.stringify({ value: 'first' }))
    .mockResponseOnce(JSON.stringify({ value: 'second' }))

  const { result } = renderHook(() =>
    useApiQuery<{ value: string }>('items', { jwtToken }),
  )

  await waitFor(() => {
    expect(result.current.data).toEqual({ value: 'first' })
  })

  await act(async () => {
    await result.current.refetch()
  })

  expect(result.current.data).toEqual({ value: 'second' })
})

test('aborts an in-flight query on unmount', async () => {
  let aborted = false
  fetchMock.mockImplementationOnce((_input, init) => {
    const signal = init?.signal as AbortSignal

    return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => {
        aborted = true
        reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }))
      })
    }) as Promise<Response>
  })

  const { unmount } = renderHook(() => useApiQuery('items', { jwtToken }))

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  unmount()

  await waitFor(() => {
    expect(aborted).toBe(true)
  })
})
