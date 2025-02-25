import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { type PersistQueryClientOptions } from '@tanstack/react-query-persist-client'
import { AsyncStorage } from 'expo-sqlite/kv-store'
import { parse, stringify } from 'superjson'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export const CACHE_KEY = 'cache-storage-1'

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError(error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console -- dev
          console.log(error)
        }

        Sentry.captureException(error)

        return false
      },
    },
    queries: {
      gcTime: usePreferences.getState().refreshInterval * 60 * 1_000,
      retry: false,
      staleTime: usePreferences.getState().refreshInterval * 60 * 1_000,
      throwOnError(error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console -- dev
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
