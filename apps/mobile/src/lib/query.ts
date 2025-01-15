import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { AsyncStorage } from 'expo-sqlite/kv-store'
import { parse, stringify } from 'superjson'

const cacheVersion = 4

export const queryClient = new QueryClient()

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
