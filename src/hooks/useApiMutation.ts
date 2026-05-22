/**
 * Typed API mutation hook built on the shared API request client.
 * @module hooks/useApiMutation
 */
import * as React from 'react'
import apiRequest, {
  ApiRequestError,
  ApiRequestMethod,
  ApiRequestOptions,
  isApiRequestAbortError,
} from '@/utils/apiRequest'

export type UseApiMutationOptions = Omit<
  ApiRequestOptions,
  'body' | 'method' | 'path' | 'signal'
> & {
  method?: ApiRequestMethod
}

export type UseApiMutationOverrides<TBody = unknown> = Partial<
  ApiRequestOptions<TBody>
>

export type UseApiMutationResult<TData = unknown, TBody = unknown> = {
  abort: () => void
  data: TData | null
  error: ApiRequestError | Error | null
  loading: boolean
  mutate: (
    body?: TBody,
    overrides?: UseApiMutationOverrides<TBody>,
  ) => Promise<TData | undefined>
  reset: () => void
}

const composeAbortSignals = (
  controller: AbortController,
  signal?: AbortSignal,
) => {
  if (!signal) return controller.signal

  if (signal.aborted) {
    controller.abort()
    return controller.signal
  }

  signal.addEventListener('abort', () => controller.abort(), { once: true })

  return controller.signal
}

const useApiMutation = <TData = unknown, TBody = unknown>(
  path: string,
  { getToken, headers, jwtToken, method = 'POST' }: UseApiMutationOptions = {},
): UseApiMutationResult<TData, TBody> => {
  const [data, setData] = React.useState<TData | null>(null)
  const [error, setError] = React.useState<ApiRequestError | Error | null>(null)
  const [loading, setLoading] = React.useState(false)
  const controllerRef = React.useRef<AbortController | null>(null)
  const mountedRef = React.useRef(false)
  const optionsRef = React.useRef({ getToken, headers, jwtToken, method, path })

  React.useEffect(() => {
    optionsRef.current = { getToken, headers, jwtToken, method, path }
  }, [getToken, headers, jwtToken, method, path])

  React.useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [])

  const abort = React.useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  const reset = React.useCallback(() => {
    abort()
    setData(null)
    setError(null)
    setLoading(false)
  }, [abort])

  const mutate = React.useCallback(
    async (
      body?: TBody,
      overrides: UseApiMutationOverrides<TBody> = {},
    ): Promise<TData | undefined> => {
      abort()
      const controller = new AbortController()
      controllerRef.current = controller
      setLoading(true)
      setError(null)

      try {
        const { getToken, headers, jwtToken, method, path } = optionsRef.current
        const response = await apiRequest<TData, TBody>({
          body,
          getToken,
          headers,
          jwtToken,
          method,
          path,
          ...overrides,
          signal: composeAbortSignals(controller, overrides.signal),
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

        throw caughtError
      } finally {
        if (mountedRef.current && controllerRef.current === controller) {
          setLoading(false)
        }
      }
    },
    [abort],
  )

  return {
    abort,
    data,
    error,
    loading,
    mutate,
    reset,
  }
}

export default useApiMutation
