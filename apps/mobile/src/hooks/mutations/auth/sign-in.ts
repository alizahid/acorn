import { Reddit } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as Crypto from 'expo-crypto'
import { useRouter } from 'expo-router'
import cookies from 'react-native-nitro-cookies'
import { toast } from 'sonner-native'
import { useShallow } from 'zustand/react/shallow'

import { fetchToken } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const router = useRouter()

  const { add } = useAuth(
    useShallow((state) => ({
      add: state.add,
    })),
  )

  const { isPending, mutateAsync } = useMutation({
    async mutationFn(cookie: string) {
      await Promise.all([cookies.clearAll(), cookies.clearAll(true)])

      const { expiresAt, token } = await fetchToken(cookie)

      const reddit = new Reddit({
        deviceId: Crypto.randomUUID(),
        token,
      })

      const { name } = await reddit.users.me()

      return {
        cookie,
        expiresAt,
        id: name,
        token,
      }
    },
    onError(error) {
      toast.error(error.message)
    },
    onSuccess(data) {
      router.dismiss()

      add(data)
    },
  })

  return {
    isPending,
    signIn: mutateAsync,
  }
}
