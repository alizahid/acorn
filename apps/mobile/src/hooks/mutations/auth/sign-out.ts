import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@tanstack/react-query'

import { CACHE_KEY, queryClient } from '~/lib/query'
import { useAuth } from '~/stores/auth'

export function useSignOut() {
  const { accountId, removeAccount, setAccount } = useAuth()

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      queryClient.clear()

      await AsyncStorage.removeItem(CACHE_KEY)

      if (accountId) {
        const accounts = removeAccount(accountId)

        const next = accounts.at(0)

        if (next) {
          setAccount(next.id)
        }
      }
    },
  })

  return {
    isPending,
    signOut: mutate,
  }
}
