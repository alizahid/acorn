import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useState } from 'react'
import { useStyles } from 'react-native-unistyles'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export function useLink() {
  const router = useRouter()

  const { linkBrowser } = usePreferences()

  const { theme } = useStyles()

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const open = useCallback(
    async (url: string) => {
      try {
        setVisible(true)

        await WebBrowser.openBrowserAsync(url, {
          controlsColor: theme.colors.accent[9],
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          toolbarColor: theme.colors.gray[1],
        })
      } finally {
        setVisible(false)
      }
    },
    [theme.colors.accent, theme.colors.gray],
  )

  const handleLink = useCallback(
    async (href: string) => {
      try {
        const url = new URL(
          href,
          href.startsWith('http') ? undefined : 'https://reddit.com',
        )

        if (url.hostname.endsWith('reddit.com')) {
          if (url.pathname.includes('/wiki/')) {
            void open(href)
          } else if (url.pathname.includes('/s/')) {
            setLoading(true)

            const response = await fetch(url, {
              method: 'trace',
            })

            void handleLink(response.url)

            setLoading(false)
          } else if (url.pathname.startsWith('/r/')) {
            const [, , name, , id, , commentId] = url.pathname.split('/')

            if (commentId && id) {
              router.push({
                params: {
                  commentId,
                  id,
                },
                pathname: '/posts/[id]',
              })
            } else if (id) {
              router.push({
                params: {
                  id,
                },
                pathname: '/posts/[id]',
              })
            } else if (name) {
              router.push({
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
              router.push({
                params: {
                  id,
                },
                pathname: '/posts/[id]',
              })
            } else if (name) {
              router.push({
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
          void open(href)
        }
      } catch (error) {
        Sentry.captureException(error)

        if (linkBrowser) {
          void Linking.openURL(href)
        } else {
          void open(href)
        }
      } finally {
        setLoading(false)
      }
    },
    [linkBrowser, open, router],
  )

  return {
    handleLink,
    loading,
    visible,
  }
}
