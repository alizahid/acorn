import { createId } from '@paralleldrive/cuid2'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as SecureStore from 'expo-secure-store'
import { createMMKV, type MMKV } from 'react-native-mmkv'
import { parse, stringify } from 'superjson'
import { type StateStorage } from 'zustand/middleware'

export const ENCRYPTION_KEY = 'encryption-key'

export class Store implements StateStorage {
  client: MMKV

  constructor(id: string) {
    this.client = createMMKV({
      encryptionKey: this.encryptionKey,
      id,
    })
  }

  getItem<Type>(key: string) {
    const value = this.client.getString(key)

    if (!value) {
      return null
    }

    return parse<Type>(value)
  }

  removeItem(key: string) {
    this.client.remove(key)
  }

  setItem(key: string, value: unknown) {
    this.client.set(key, stringify(value))
  }

  clear() {
    this.client.clearAll()
  }

  private get encryptionKey() {
    const exists = SecureStore.getItem(ENCRYPTION_KEY)

    if (exists) {
      return exists
    }

    const key = createId()

    SecureStore.setItem(ENCRYPTION_KEY, key)

    return key
  }
}
