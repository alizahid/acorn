import { createId } from '@paralleldrive/cuid2'
import * as SecureStore from 'expo-secure-store'
import { MMKV } from 'react-native-mmkv'
import { type StateStorage } from 'zustand/middleware'

export const ENCRYPTION_KEY = 'encryption-key'

export class Store implements StateStorage {
  client: MMKV

  constructor(id: string) {
    this.client = new MMKV({
      encryptionKey: this.encryptionKey,
      id,
    })
  }

  getItem(key: string) {
    return this.client.getString(key) ?? null
  }

  removeItem(key: string) {
    this.client.delete(key)
  }

  setItem(key: string, value: string) {
    this.client.set(key, value)
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
