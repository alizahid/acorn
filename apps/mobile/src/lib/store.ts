import * as SecureStore from 'expo-secure-store'
import { type StateStorage } from 'zustand/middleware'

export class Store implements StateStorage {
  getItem(name: string) {
    return SecureStore.getItemAsync(name)
  }

  removeItem(name: string) {
    return SecureStore.deleteItemAsync(name)
  }

  setItem(name: string, value: string) {
    return SecureStore.setItemAsync(name, value)
  }
}
