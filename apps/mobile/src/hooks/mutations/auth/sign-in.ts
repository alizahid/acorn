import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { REDDIT_URI, USER_AGENT } from '~/reddit/config'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const router = useRouter()

  const t = useTranslations('hook.auth.signIn')

  const { add } = useAuth()

  const { isPending, mutateAsync } = useMutation({
    async mutationFn(cookie: string) {
      const url = new URL('/api/me.json', REDDIT_URI)

      const response = await fetch(url, {
        headers: {
          cookie: `reddit_session=${cookie}`,
          'user-agent': USER_AGENT,
        },
      })

      const json = (await response.json()) as {
        data?: {
          modhash?: string
          name?: string
        }
      }

      const name = json.data?.name
      const modhash = json.data?.modhash

      if (!name || !modhash) {
        throw new Error(t('error'))
      }

      return {
        cookie,
        id: name,
        modhash,
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
