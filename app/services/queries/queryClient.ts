import { QueryClient, QueryCache } from "@tanstack/react-query"

/**
 * Global QueryClient instance.
 * Configure global defaults here (staleTime, gcTime, retry, etc.).
 *
 * This configuration combines:
 * 1. Global defaults for better performance/UX (freshness, caching).
 * 2. Global error handling via QueryCache to avoid repetitive try-catch in hooks.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Unused data is garbage collected after 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus (optional, often better for mobile)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Default mutation behavior
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only log if the query has extensive error details
      // In a real app, this could be a global toast notification
      if (__DEV__) {
        console.log("Query Error:", {
          key: query.queryKey,
          error: error.message,
          failureCount: query.state.fetchFailureCount,
        })
      }
    },
  }),
})

export interface QueryError {
  options?: Options
  gcTime?: number
  observers?: Observer[]
  queryKey?: string[]
  queryHash?: string
  state?: State
}

export interface Observer {
  listeners?: Listeners
  options?: Options
}

export interface Listeners {}

export interface Options {
  queryKey?: string[]
  staleTime?: number
  _defaulted?: boolean
  queryHash?: string
  refetchOnReconnect?: boolean
  throwOnError?: boolean
  _optimisticResults?: string
}

export interface State {
  dataUpdateCount?: number
  dataUpdatedAt?: number
  error?: Error
  errorUpdateCount?: number
  errorUpdatedAt?: number
  fetchFailureCount?: number
  fetchFailureReason?: Error
  fetchMeta?: null
  isInvalidated?: boolean
  status?: string
  fetchStatus?: string
}

export interface Error {
  kind?: string
  path?: string
  message?: string
}
