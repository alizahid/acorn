import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'

export const CACHE_KEY = 'cache-storage'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
    },
  },
})

export const persister = createAsyncStoragePersister({
  key: CACHE_KEY,
  storage: AsyncStorage,
})
