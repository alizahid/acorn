import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'
import { z } from 'zod'

import { getUserAgent } from '~/lib/user-agent'
import { REDDIT_URI } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

const schema = z.object({
  data: z.object({
    modhash: z.string(),
    name: z.string(),
  }),
})

export function useSignIn() {
  const router = useRouter()

  const add = useAuth((state) => state.add)

  const { isPending, mutateAsync } = useMutation({
    async mutationFn(cookie: string) {
      const url = new URL('/api/me.json', REDDIT_URI)

      const response = await fetch(url, {
        headers: {
          cookie: `reddit_session=${cookie}`,
          'user-agent': getUserAgent(),
        },
      })

      const json = await response.json()

      const { data } = schema.parse(json)

      return {
        cookie,
        id: data.name,
        modHash: data.modhash,
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
