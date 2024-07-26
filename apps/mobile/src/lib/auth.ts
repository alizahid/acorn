import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

import { AUTH_KEY, useAuth } from '~/stores/auth'
import { PREFERENCES_KEY } from '~/stores/preferences'

import { CACHE_KEY, queryClient } from './query'

export async function signOut() {
  queryClient.clear()

  await AsyncStorage.removeItem(CACHE_KEY)

  useAuth.setState({
    accessToken: null,
    clientId: null,
    expiresAt: null,
    refreshToken: null,
  })

  await SecureStore.deleteItemAsync(AUTH_KEY)
  await SecureStore.deleteItemAsync(PREFERENCES_KEY)
}
