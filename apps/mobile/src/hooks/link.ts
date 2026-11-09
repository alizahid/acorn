// biome-ignore lint/performance/noNamespaceImport: go away
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as WebBrowser from 'expo-web-browser'
import { useCallback } from 'react'
import { fetch } from 'react-native-nitro-fetch'
import { useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { parseLink } from '~/lib/link'
import { lockOrientation, unlockOrientation } from '~/lib/orientation'
import { Sentry } from '~/lib/sentry'
import { toast } from '~/lib/toast'
import { REDDIT_OLD_URI, REDDIT_URI } from '~/reddit/api'
import { usePreferences } from '~/stores/preferences'

import { useFocused } from './focus'

export function useLink() {
  const router = useRouter()

  const t = useTranslations('toasts.link')

  const { linkBrowser, oldReddit } = usePreferences(
    useShallow((state) => ({
      linkBrowser: state.linkBrowser,
      oldReddit: state.oldReddit,
    })),
  )

  const { setFocused } = useFocused()

  const { theme } = useUnistyles()

  const openInApp = useCallback(
    async (url: string) => {
      try {
        setFocused(false)

        unlockOrientation()

        await WebBrowser.openBrowserAsync(url, {
          controlsColor: theme.colors.accent.accent,
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          toolbarColor: theme.colors.gray.bg,
        })
      } finally {
        setFocused(true)

        lockOrientation()
      }
    },
    [theme.colors.accent, theme.colors.gray, setFocused],
  )

  const openInBrowser = useCallback((url: string) => {
    Linking.openURL(url)
  }, [])

  const handle = useCallback(
    (url: string) => {
      if (linkBrowser) {
        openInBrowser(url)

        return
      }

      openInApp(url)
    },
    [linkBrowser, openInApp, openInBrowser],
  )

  const handleLink = useCallback(
    async (href: string) => {
      const url = new URL(
        href,
        href.startsWith('http')
          ? undefined
          : oldReddit
            ? REDDIT_OLD_URI
            : REDDIT_URI,
      )

      const uri = url.toString()

      try {
        const parts = parseLink(
          uri.includes('reddit.com') ? uri.replace('/u/', '/user/') : uri,
        )

        if (parts?.shareId) {
          const id = toast.loading(t('loading'), {
            duration: Number.POSITIVE_INFINITY,
          })

          const response = await fetch(url, {
            credentials: 'omit',
            redirect: 'follow',
          })

          toast.dismiss(id)

          handleLink(response.url)

          return
        }

        if (parts?.postId) {
          router.navigate({
            params: {
              commentId: parts.commentId,
              id: parts.postId,
            },
            pathname: '/posts/[id]',
          })

          return
        }

        if (parts?.feed) {
          router.navigate({
            params: {
              feed: parts.feed,
            },
            pathname: '/',
          })

          return
        }

        if (parts?.user) {
          router.navigate({
            params: {
              name: parts.user,
            },
            pathname: '/users/[name]',
          })

          return
        }

        if (parts?.community) {
          router.navigate({
            params: {
              name: parts.community,
            },
            pathname: '/communities/[name]',
          })

          return
        }

        handle(uri)
      } catch (error) {
        Sentry.captureException(error)

        handle(uri)
      }
    },
    [handle, oldReddit, router, t],
  )

  return {
    handleLink,
    openInApp,
    openInBrowser,
  }
}
