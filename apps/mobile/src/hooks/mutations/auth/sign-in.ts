import { exchangeSessionCookie } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import cookies, { type Cookies } from 'react-native-nitro-cookies'
import { toast } from 'sonner-native'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { createApi } from '~/reddit/api'
import { type Account, useAuth } from '~/stores/auth'

const schema = z.object({
  cookie: z.string(),
  loid: z.string(),
})

export function useSignIn() {
  const router = useRouter()

  const { add } = useAuth(
    useShallow((state) => ({
      add: state.add,
    })),
  )

  const { isPending, mutateAsync } = useMutation<Account, Error, Cookies>({
    async mutationFn(variables) {
      const jar = schema.parse({
        cookie: variables.reddit_session?.value,
        loid: variables.loid?.value,
      })

      await cookies.clearAll(true)

      const { edgeBucket, expiresAt, token, loid } =
        await exchangeSessionCookie({
          cookie: jar.cookie,
          loid: jar.loid,
        })

      if (!loid) {
        throw new Error('Something went wrong')
      }

      const reddit = await createApi({
        edgeBucket,
        loid,
        token,
      })

      const { name } = await reddit.users.me()

      return {
        cookie: jar.cookie,
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
