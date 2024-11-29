import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { AsyncStorage } from 'expo-sqlite/kv-store'
import { parse, stringify } from 'superjson'

import { Sentry } from './sentry'

const cacheVersion = 3
const cacheTime = 1_000 * 60 * 10

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
      gcTime: cacheTime,
      retry: false,
      staleTime: cacheTime,
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
  key: `cache-storage-${cacheVersion}`,
  serialize(client) {
    return stringify(client)
  },
  storage: AsyncStorage,
})
