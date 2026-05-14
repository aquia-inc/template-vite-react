/**
 * Compatibility wrapper for API-backed fetches.
 * @module hooks/useFetch
 */
import useApiQuery, {
  UseApiQueryOptions,
  UseApiQueryResult,
} from '@/hooks/useApiQuery'

const useFetch = <TData = unknown>(
  path: string | null,
  options?: UseApiQueryOptions<TData>,
): UseApiQueryResult<TData> => {
  return useApiQuery<TData>(path, options)
}

export default useFetch
