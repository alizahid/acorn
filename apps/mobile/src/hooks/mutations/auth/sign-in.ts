import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { addSeconds } from 'date-fns'
import { useRouter } from 'expo-router'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as SecureStore from 'expo-secure-store'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as WebBrowser from 'expo-web-browser'
import { useUnistyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { CLIENT_ID_KEY } from '~/components/auth/client-id'
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

      const clientId = await SecureStore.getItemAsync(CLIENT_ID_KEY)

      if (clientId) {
        oauth.searchParams.set('clientId', clientId)
      }

      const result = await WebBrowser.openAuthSessionAsync(
        oauth.toString(),
        REDIRECT_URI,
        {
          controlsColor: theme.colors.accent.accent,
          // preferEphemeralSession: true,
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

      if (clientId) {
        const code = url.searchParams.get('code')

        if (!code) {
          throw new Error(t('error'))
        }

        return getAccount({
          clientId,
          code,
        })
      }

      const id = url.searchParams.get('id')
      const accessToken = url.searchParams.get('accessToken')
      const refreshToken = url.searchParams.get('refreshToken')
      const expiresAt = url.searchParams.get('expiresAt')

      if (!(id && accessToken && refreshToken && expiresAt)) {
        throw new Error(t('error'))
      }

      return {
        accessToken,
        expiresAt,
        id,
        refreshToken,
      }
    },
    onError(error) {
      toast.error(error.message)
    },
    onSuccess(data) {
      router.dismiss()

      add({
        ...data,
        expiresAt: addSeconds(new Date(), Number(data.expiresAt) - 60),
      })
    },
  })

  return {
    isPending,
    signIn: mutateAsync,
  }
}

async function getAccount({
  clientId,
  code,
}: {
  clientId: string
  code: string
}) {
  const url = new URL('/api/auth/token', process.env.EXPO_PUBLIC_WEB_URL)

  const response = await fetch(url, {
    body: JSON.stringify({
      clientId,
      code,
    }),
    method: 'post',
  })

  const data = (await response.json()) as
    | {
        accessToken: string
        expiresAt: string
        id: string
        refreshToken: string
      }
    | {
        error: string
      }

  if ('error' in data) {
    throw new Error(data.error)
  }

  return data
}
