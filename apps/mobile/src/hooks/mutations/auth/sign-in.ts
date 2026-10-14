import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import cookies from 'react-native-nitro-cookies'
import { toast } from 'sonner-native'
import { useShallow } from 'zustand/react/shallow'

import { createApi, fetchToken } from '~/reddit/api'
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

      const { edgeBucket, expiresAt, token, loid } = await fetchToken(cookie)

      const reddit = await createApi({
        edgeBucket,
        loid,
        token,
      })

      const { name } = await reddit.users.me()

      return {
        cookie,
        edgeBucket,
        expiresAt,
        id: name,
        loid,
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
