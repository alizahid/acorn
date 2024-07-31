import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@tanstack/react-query'

import { CACHE_KEY, queryClient } from '~/lib/query'
import { useAuth } from '~/stores/auth'

export function useSwitch() {
  const { setAccount } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, string>({
    async mutationFn(id) {
      queryClient.clear()

      await AsyncStorage.removeItem(CACHE_KEY)

      setAccount(id)
    },
  })

  return {
    isPending,
    switchAccount: mutate,
  }
}
