import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { addSeconds } from 'date-fns'
import { useRouter } from 'expo-router'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as WebBrowser from 'expo-web-browser'
import { useUnistyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { REDIRECT_URI } from '~/reddit/config'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const router = useRouter()

  const t = useTranslations('hook.auth.signIn')

  const { add } = useAuth()

  const { theme } = useUnistyles()

  const { isPending, mutateAsync } = useMutation({
    async mutationFn() {
      const state = createId()

      const oauth = new URL('/api/auth/code', process.env.EXPO_PUBLIC_WEB_URL)

      oauth.searchParams.set('state', state)

      const result = await WebBrowser.openAuthSessionAsync(
        oauth.toString(),
        REDIRECT_URI,
        {
          controlsColor: theme.colors.accent.accent,
          preferEphemeralSession: true,
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          toolbarColor: theme.colors.gray.bg,
        },
      )

      if (result.type !== 'success') {
        throw new Error(t('error'))
      }

      const url = new URL(result.url)

      const error = url.searchParams.get('error')

      if (error) {
        throw new Error(error)
      }

      if (url.searchParams.get('state') !== state) {
        throw new Error(t('error'))
      }

      const id = url.searchParams.get('id')
      const accessToken = url.searchParams.get('accessToken')
      const refreshToken = url.searchParams.get('refreshToken')
      const expiresAt = url.searchParams.get('expiresAt')

      if (!(id && accessToken && refreshToken && expiresAt)) {
        throw new Error(t('error'))
      }

      add({
        accessToken,
        expiresAt: addSeconds(new Date(), Number(expiresAt) - 60),
        id,
        refreshToken,
      })
    },
    onError(error) {
      toast.error(error.message)
    },
    onSuccess() {
      router.dismiss()
    },
  })

  return {
    isPending,
    signIn: mutateAsync,
  }
}
