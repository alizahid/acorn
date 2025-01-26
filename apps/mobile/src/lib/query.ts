import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { AsyncStorage } from 'expo-sqlite/kv-store'
import { parse, stringify } from 'superjson'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export const CACHE_KEY = 'cache-storage-6'

export const queryClient = new QueryClient({
  defaultOptions: {
    dehydrate: {
      shouldDehydrateQuery(query) {
        const first = String(query.queryKey[0])

        return /communities|feeds|inbox|submission|unread|redgifs/.test(first)
      },
    },
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

export const persister = createAsyncStoragePersister({
  deserialize(cache) {
    return parse(cache)
  },
  key: CACHE_KEY,
  serialize(client) {
    return stringify(client)
  },
  storage: AsyncStorage,
})
