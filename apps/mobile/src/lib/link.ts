import * as Linking from 'expo-linking'
import { router } from 'expo-router'

import { Sentry } from './sentry'

export function handleLink(href: string) {
  try {
    const url = new URL(href)

    if (url.hostname.endsWith('reddit.com')) {
      if (url.pathname.startsWith('/r/')) {
        const [, , name, , id, , commentId] = url.pathname.split('/')

        if (commentId) {
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
        } else {
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
        } else {
          router.navigate({
            params: {
              name,
              type: 'submitted',
            },
            pathname: '/users/[name]/[type]',
          })
        }
      }
    } else {
      void Linking.openURL(href)
    }
  } catch (error) {
    Sentry.captureException(error)

    void Linking.openURL(href)
  }
}
