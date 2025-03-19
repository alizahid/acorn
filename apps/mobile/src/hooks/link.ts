import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useState } from 'react'
import { useStyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export function useLink() {
  const router = useRouter()

  const t = useTranslations('toasts.link')

  const { linkBrowser, oldReddit } = usePreferences()

  const { theme } = useStyles()

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const open = useCallback(
    async (url: string) => {
      try {
        setVisible(true)

        await WebBrowser.openBrowserAsync(url, {
          controlsColor: theme.colors.accent.accent,
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          toolbarColor: theme.colors.gray.bg,
        })
      } finally {
        setVisible(false)
      }
    },
    [theme.colors.accent, theme.colors.gray],
  )

  const handle = useCallback(
    (url: string) => {
      if (linkBrowser) {
        void Linking.openURL(url)

        return
      }

      void open(url)
    },
    [linkBrowser, open],
  )

  const handleLink = useCallback(
    async (href: string) => {
      try {
        const url = new URL(
          href,
          href.startsWith('http')
            ? undefined
            : oldReddit
              ? 'https://old.reddit.com'
              : 'https://reddit.com',
        )

        const match =
          /^(?:https?:\/\/)?(?:(?:www|amp|m|i)\.)?(?:(?:reddit\.com))(?:\/r\/(\w+)(?:\/(?:comments\/(\w+)(?:\/[^/]+(?:\/(?:comment\/)?(\w+))?)?|wiki\/([^/?]+)|s\/(\w+)))?(?:\/?.*?(?:[?&]context=(\d+))?)?|\/user\/(\w+)\/(?:m\/(\w+)|comments\/(\w+)(?:\/[^/]+)?(?:\/?.*?(?:[?&]context=(\d+))?)?))/i.exec(
            url.toString(),
          )

        if (match) {
          const community = match[1]
          const postId = match[2] ?? match[9]
          const commentId = match[3]
          const shareId = match[5]
          const context = match[6] ?? match[10]
          const user = match[7]
          const feed = match[8]

          if (postId) {
            router.push({
              params: {
                commentId,
                context,
                id: postId,
              },
              pathname: '/posts/[id]',
            })

            return
          }

          if (feed) {
            router.push({
              params: {
                feed,
              },
              pathname: '/',
            })

            return
          }

          if (shareId) {
            const id = toast.loading(t('loading'), {
              duration: Infinity,
            })

            const response = await fetch(url, {
              method: 'trace',
            })

            toast.dismiss(id)

            void handleLink(response.url)

            return
          }

          if (user) {
            router.push({
              params: {
                name: user,
              },
              pathname: '/users/[name]',
            })

            return
          }

          if (community) {
            router.push({
              params: {
                name: community,
              },
              pathname: '/communities/[name]',
            })

            return
          }
        }

        handle(href)
      } catch (error) {
        Sentry.captureException(error)

        handle(href)
      } finally {
        setLoading(false)
      }
    },
    [handle, oldReddit, router, t],
  )

  return {
    handleLink,
    loading,
    open,
    visible,
  }
}
