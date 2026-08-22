import { useMemo, useCallback } from 'react'

export interface QueryOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
  cacheTime?: number
}

export function useQuery<T>(
  key: string | string[],
  fetcher: () => Promise<T>,
  options: QueryOptions = {}
) {
  void options
  // This is a simple wrapper - in production, use TanStack Query
  // We'll provide a compatibility layer here
  const queryKey = useMemo(() => 
    Array.isArray(key) ? key : [key],
    [key]
  )

  const execute = useCallback(async () => {
    try {
      const result = await fetcher()
      return { data: result, error: null, isLoading: false }
    } catch (error) {
      return { data: null, error, isLoading: false }
    }
  }, [fetcher])

  return { execute, queryKey }
}

export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>
) {
  const execute = useCallback(
    async (variables: V) => {
      try {
        const result = await mutationFn(variables)
        return { data: result, error: null, isLoading: false }
      } catch (error) {
        return { data: null, error, isLoading: false }
      }
    },
    [mutationFn]
  )

  return { execute }
}