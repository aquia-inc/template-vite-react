import * as React from 'react'
import { renderHook, waitFor, act } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import useApiMutation from '@/hooks/useApiMutation'
import { ApiRequestError } from '@/utils/apiRequest'

const jwtToken = 'test-token'

beforeEach(() => {
  fetchMock.resetMocks()
})

test('mutates typed data with a request body', async () => {
  const body = { name: 'New item' }
  const data = { id: '1', name: 'New item' }
  fetchMock.mockResponseOnce(JSON.stringify(data))

  const { result } = renderHook(() =>
    useApiMutation<typeof data, typeof body>('items', { jwtToken }),
  )

  await act(async () => {
    await expect(result.current.mutate(body)).resolves.toEqual(data)
  })

  expect(result.current.data).toEqual(data)
  expect(result.current.error).toBeNull()
  expect(result.current.loading).toBe(false)
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('/v1/items'),
    expect.objectContaining({
      body: JSON.stringify(body),
      method: 'POST',
    }),
  )
})

test('stores and rethrows normalized mutation errors', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ error: 'Invalid item' }), {
    status: 422,
    statusText: 'Unprocessable Entity',
  })

  const { result } = renderHook(() =>
    useApiMutation('items', { jwtToken, method: 'PATCH' }),
  )
  let caughtError: unknown

  await act(async () => {
    try {
      await result.current.mutate({ name: '' })
    } catch (error) {
      caughtError = error
    }
  })

  expect(caughtError).toBeInstanceOf(ApiRequestError)
  expect(result.current.error).toMatchObject({
    message: 'Invalid item',
    status: 422,
  })
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('/v1/items'),
    expect.objectContaining({
      method: 'PATCH',
    }),
  )
})

test('resets mutation state', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))

  const { result } = renderHook(() => useApiMutation('items', { jwtToken }))

  await act(async () => {
    await result.current.mutate({ name: 'Item' })
  })

  expect(result.current.data).toEqual({ ok: true })

  act(() => {
    result.current.reset()
  })

  expect(result.current.data).toBeNull()
  expect(result.current.error).toBeNull()
  expect(result.current.loading).toBe(false)
})

test('aborts an active mutation', async () => {
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

  const { result } = renderHook(() => useApiMutation('items', { jwtToken }))
  let mutation: Promise<unknown> | undefined

  act(() => {
    mutation = result.current.mutate({ name: 'Slow item' })
  })

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  act(() => {
    result.current.abort()
  })

  await act(async () => {
    await expect(mutation).resolves.toBeUndefined()
  })
  expect(aborted).toBe(true)
})

test('aborts a mutation started with a caller-provided signal', async () => {
  let aborted = false
  const callerController = new AbortController()
  fetchMock.mockImplementationOnce((_input, init) => {
    const signal = init?.signal as AbortSignal

    return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => {
        aborted = true
        reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }))
      })
    }) as Promise<Response>
  })

  const { result } = renderHook(() => useApiMutation('items', { jwtToken }))
  let mutation: Promise<unknown> | undefined

  act(() => {
    mutation = result.current.mutate(
      { name: 'Slow item' },
      { signal: callerController.signal },
    )
  })

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  act(() => {
    result.current.abort()
  })

  await act(async () => {
    await expect(mutation).resolves.toBeUndefined()
  })
  expect(aborted).toBe(true)
})

test('caller-provided signals can abort active mutations', async () => {
  let aborted = false
  const callerController = new AbortController()
  fetchMock.mockImplementationOnce((_input, init) => {
    const signal = init?.signal as AbortSignal

    return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => {
        aborted = true
        reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }))
      })
    }) as Promise<Response>
  })

  const { result } = renderHook(() => useApiMutation('items', { jwtToken }))
  let mutation: Promise<unknown> | undefined

  act(() => {
    mutation = result.current.mutate(
      { name: 'Slow item' },
      { signal: callerController.signal },
    )
  })

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  act(() => {
    callerController.abort()
  })

  await act(async () => {
    await expect(mutation).resolves.toBeUndefined()
  })
  expect(aborted).toBe(true)
})

test('updates state when rendered in Strict Mode', async () => {
  const data = { id: '1' }
  fetchMock.mockResponseOnce(JSON.stringify(data))

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.StrictMode, null, children)
  const { result } = renderHook(
    () => useApiMutation<typeof data, { name: string }>('items', { jwtToken }),
    { wrapper },
  )

  await act(async () => {
    await expect(result.current.mutate({ name: 'Item' })).resolves.toEqual(data)
  })

  expect(result.current.data).toEqual(data)
})
