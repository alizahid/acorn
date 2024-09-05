import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { keepPreviousData, QueryClient } from '@tanstack/react-query'
import { parse, stringify } from 'superjson'

import { Sentry } from './sentry'

export const CACHE_KEY = 'cache-storage'

export const CACHE_TIME = 1_000 * 60 * 60

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
      gcTime: Infinity,
      placeholderData: keepPreviousData,
      staleTime: CACHE_TIME,
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
