import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback } from 'react'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export function useLink() {
  const router = useRouter()

  const { browser } = usePreferences()

  return useCallback(
    (href: string) => {
      try {
        const url = new URL(href)

        if (url.hostname.endsWith('reddit.com')) {
          if (url.pathname.startsWith('/r/')) {
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
                  type: 'submitted',
                },
                pathname: '/users/[name]/[type]',
              })
            }
          }
        } else if (browser) {
          void Linking.openURL(href)
        } else {
          void WebBrowser.openBrowserAsync(href, {
            presentationStyle:
              WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
          })
        }
      } catch (error) {
        Sentry.captureException(error)

        if (browser) {
          void Linking.openURL(href)
        } else {
          void WebBrowser.openBrowserAsync(href, {
            presentationStyle:
              WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
          })
        }
      }
    },
    [browser, router],
  )
}
