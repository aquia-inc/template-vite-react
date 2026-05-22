/**
 * Typed API query hook built on the shared API request client.
 * @module hooks/useApiQuery
 */
import * as React from 'react'
import apiRequest, {
  ApiRequestError,
  ApiRequestOptions,
  isApiRequestAbortError,
} from '@/utils/apiRequest'

export type UseApiQueryOptions<TData = unknown> = Omit<
  ApiRequestOptions,
  'body' | 'method' | 'path' | 'signal'
> & {
  enabled?: boolean
  initialData?: TData | null
}

export type UseApiQueryResult<TData = unknown> = {
  data: TData | null
  error: ApiRequestError | Error | null
  loading: boolean
  refetch: () => Promise<TData | undefined>
}

const useApiQuery = <TData = unknown>(
  path: string | null,
  {
    enabled = true,
    getToken,
    headers,
    initialData = null,
    jwtToken,
  }: UseApiQueryOptions<TData> = {},
): UseApiQueryResult<TData> => {
  const [data, setData] = React.useState<TData | null>(initialData)
  const [error, setError] = React.useState<ApiRequestError | Error | null>(null)
  const [loading, setLoading] = React.useState(false)
  const controllerRef = React.useRef<AbortController | null>(null)
  const mountedRef = React.useRef(false)
  const optionsRef = React.useRef({ getToken, headers, initialData, jwtToken })

  React.useEffect(() => {
    optionsRef.current = { getToken, headers, initialData, jwtToken }
  }, [getToken, headers, initialData, jwtToken])

  React.useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [])

  const runQuery = React.useCallback(async () => {
    if (!path || !enabled) {
      controllerRef.current?.abort()
      setData(optionsRef.current.initialData)
      setError(null)
      setLoading(false)
      return undefined
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError(null)

    try {
      const { getToken, headers, jwtToken } = optionsRef.current
      const response = await apiRequest<TData>({
        getToken,
        headers,
        jwtToken,
        path,
        signal: controller.signal,
      })

      if (mountedRef.current && !controller.signal.aborted) {
        setData(response ?? null)
      }

      return response
    } catch (caughtError) {
      if (isApiRequestAbortError(caughtError)) {
        return undefined
      }

      if (mountedRef.current) {
        setError(caughtError as ApiRequestError | Error)
      }

      return undefined
    } finally {
      if (mountedRef.current && controllerRef.current === controller) {
        setLoading(false)
      }
    }
  }, [enabled, path])

  React.useEffect(() => {
    let active = true

    void Promise.resolve().then(() => {
      if (active) void runQuery()
    })

    return () => {
      active = false
      controllerRef.current?.abort()
    }
  }, [runQuery])

  return {
    data,
    error,
    loading,
    refetch: runQuery,
  }
}

export default useApiQuery
