import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { type PersistQueryClientOptions } from '@tanstack/react-query-persist-client'
import { AsyncStorage } from 'expo-sqlite/kv-store'
import { parse, stringify } from 'superjson'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export const CACHE_KEY = 'cache-storage-5'

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError(error) {
        // biome-ignore lint/correctness/noUndeclaredVariables: go away
        if (__DEV__) {
          // biome-ignore lint/suspicious/noConsole: go away
          console.log(error)
        }

        Sentry.captureException(error)

        return false
      },
    },
    queries: {
      gcTime: usePreferences.getState().refreshInterval * 60 * 1000,
      retry: false,
      staleTime: usePreferences.getState().refreshInterval * 60 * 1000,
      throwOnError(error) {
        // biome-ignore lint/correctness/noUndeclaredVariables: go away
        if (__DEV__) {
          // biome-ignore lint/suspicious/noConsole: go away
          console.log(error)
        }

        Sentry.captureException(error)

        return false
      },
    },
  },
})

export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  buster: CACHE_KEY,
  dehydrateOptions: {
    shouldDehydrateQuery(query) {
      return (
        query.state.status === 'success' &&
        query.options.networkMode === 'offlineFirst'
      )
    },
  },
  persister: createAsyncStoragePersister({
    deserialize(cache) {
      return parse(cache)
    },
    serialize(client) {
      return stringify(client)
    },
    storage: AsyncStorage,
  }),
}
