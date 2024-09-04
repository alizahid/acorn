import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback } from 'react'
import { useStyles } from 'react-native-unistyles'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export function useLink() {
  const router = useRouter()

  const { linkBrowser } = usePreferences()

  const { theme } = useStyles()

  const open = useCallback(
    (url: string) => {
      void WebBrowser.openBrowserAsync(url, {
        controlsColor: theme.colors.accent[9],
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        toolbarColor: theme.colors.gray[3],
      })
    },
    [theme.colors.accent, theme.colors.gray],
  )

  const handleLink = useCallback(
    async (href: string) => {
      try {
        const url = new URL(href)

        if (url.hostname.endsWith('reddit.com')) {
          if (url.pathname.includes('/wiki/')) {
            open(href)
          } else if (url.pathname.includes('/s/')) {
            const response = await fetch(url, {
              method: 'trace',
            })

            void handleLink(response.url)
          } else if (url.pathname.startsWith('/r/')) {
            const [, , name, , id, , commentId] = url.pathname.split('/')

            if (commentId && id) {
              router.navigate({
                params: {
                  commentId,
                  id,
                },
                pathname: '/posts/[id]',
              })
            } else if (id) {
              router.navigate({
                params: {
                  id,
                },
                pathname: '/posts/[id]',
              })
            } else if (name) {
              router.navigate({
                params: {
                  name,
                },
                pathname: '/communities/[name]',
              })
            }
          }

          if (url.pathname.startsWith('/user/')) {
            const [, , name, , id] = url.pathname.split('/')

            if (id) {
              router.navigate({
                params: {
                  id,
                },
                pathname: '/posts/[id]',
              })
            } else if (name) {
              router.navigate({
                params: {
                  name,
                },
                pathname: '/users/[name]',
              })
            }
          }
        } else if (linkBrowser) {
          void Linking.openURL(href)
        } else {
          open(href)
        }
      } catch (error) {
        Sentry.captureException(error)

        if (linkBrowser) {
          void Linking.openURL(href)
        } else {
          open(href)
        }
      }
    },
    [linkBrowser, open, router],
  )

  return handleLink
}
