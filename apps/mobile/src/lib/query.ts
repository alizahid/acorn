import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import {
  type InfiniteData,
  QueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { AsyncStorage } from 'expo-sqlite/kv-store'
import { parse, stringify } from 'superjson'

import { Sentry } from './sentry'

const cacheVersion = 2
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
