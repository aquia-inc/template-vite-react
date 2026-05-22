/**
 * Compatibility wrapper for legacy URL fetches and API-backed queries.
 * @module hooks/useFetch
 */
import * as React from 'react'
import useApiQuery, {
  UseApiQueryOptions,
  UseApiQueryResult,
} from '@/hooks/useApiQuery'

type UseFetchResult<TData = unknown> = UseApiQueryResult<TData>

const isAbsoluteHttpUrl = (url: string | null) => {
  return url !== null && /^https?:\/\//i.test(url)
}

const useRawFetch = <TData = unknown>(
  url: string | null,
): UseFetchResult<TData> => {
  const [data, setData] = React.useState<TData | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [loading, setLoading] = React.useState(false)
  const controllerRef = React.useRef<AbortController | null>(null)
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [])

  const refetch = React.useCallback(async () => {
    if (!url) {
      controllerRef.current?.abort()
      setData(null)
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
      const response = await fetch(url, { signal: controller.signal })
      const responseData = (await response.json()) as TData

      if (mountedRef.current && !controller.signal.aborted) {
        setData(responseData)
      }

      return responseData
    } catch (caughtError) {
      if (caughtError instanceof Error && caughtError.name === 'AbortError') {
        return undefined
      }

      if (mountedRef.current) {
        setError(caughtError as Error)
      }

      return undefined
    } finally {
      if (mountedRef.current && controllerRef.current === controller) {
        setLoading(false)
      }
    }
  }, [url])

  React.useEffect(() => {
    let active = true

    void Promise.resolve().then(() => {
      if (active) void refetch()
    })

    return () => {
      active = false
      controllerRef.current?.abort()
    }
  }, [refetch])

  return { data, error, loading, refetch }
}

const useFetch = <TData = unknown>(
  pathOrUrl: string | null,
  options?: UseApiQueryOptions<TData>,
): UseFetchResult<TData> => {
  const shouldUseRawFetch = isAbsoluteHttpUrl(pathOrUrl)
  const apiResult = useApiQuery<TData>(
    shouldUseRawFetch ? null : pathOrUrl,
    options,
  )
  const rawResult = useRawFetch<TData>(shouldUseRawFetch ? pathOrUrl : null)

  return shouldUseRawFetch ? rawResult : apiResult
}

export default useFetch
