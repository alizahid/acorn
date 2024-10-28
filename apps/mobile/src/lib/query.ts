import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import {
  type InfiniteData,
  QueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { parse, stringify } from 'superjson'

import { Sentry } from './sentry'

export const CACHE_KEY = 'cache-storage-v2'

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
      retry: false,
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
  deserialize(cache) {
    return parse(cache)
  },
  key: CACHE_KEY,
  serialize(client) {
    return stringify(client)
  },
  storage: AsyncStorage,
})

export function resetInfiniteQuery<Key extends QueryKey, Data>(queryKey: Key) {
  queryClient.setQueryData<InfiniteData<Data>>(queryKey, (previous) => {
    if (!previous) {
      return undefined
    }

    return {
      pageParams: previous.pageParams.slice(0, 1),
      pages: previous.pages.slice(0, 1),
    }
  })
}
