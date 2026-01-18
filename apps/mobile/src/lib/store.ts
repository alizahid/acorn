import storage from 'expo-icloud-storage'
import { parse, stringify } from 'superjson'
import { type StateStorage } from 'zustand/middleware'

export const ENCRYPTION_KEY = 'encryption-key'

export class Store implements StateStorage {
  getItem<Type>(key: string) {
    const value = storage.getString(key)

    if (!value) {
      return null
    }

    return parse<Type>(value)
  }

  removeItem(key: string) {
    storage.remove(key)
  }

  setItem(key: string, value: unknown) {
    storage.set(key, stringify(value))
  }
}
