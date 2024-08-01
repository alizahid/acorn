import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'

import { Sentry } from './sentry'

export const CACHE_KEY = 'cache-storage'

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError(error) {
        Sentry.captureException(error)

        return false
      },
    },
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
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
  key: CACHE_KEY,
  storage: AsyncStorage,
})
