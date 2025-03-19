import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useState } from 'react'
import { useStyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'
import { type Nullable, type Undefined } from '~/types'

export function useLink() {
  const router = useRouter()

  const t = useTranslations('toasts.link')

  const { linkBrowser, oldReddit } = usePreferences()

  const { theme } = useStyles()

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const openInApp = useCallback(
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

  const openInBrowser = useCallback((url: string) => {
    void Linking.openURL(url)
  }, [])

  const handle = useCallback(
    (url: string) => {
      if (linkBrowser) {
        openInBrowser(url)

        return
      }

      void openInApp(url)
    },
    [linkBrowser, openInApp, openInBrowser],
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

        const match = parseLink(url.toString())

        if (match?.shareId) {
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

        if (match?.postId) {
          router.push({
            params: {
              commentId: match.commentId,
              id: match.postId,
            },
            pathname: '/posts/[id]',
          })

          return
        }

        if (match?.feed) {
          router.push({
            params: {
              feed: match.feed,
            },
            pathname: '/',
          })

          return
        }

        if (match?.user) {
          router.push({
            params: {
              name: match.user,
            },
            pathname: '/users/[name]',
          })

          return
        }

        if (match?.community) {
          router.push({
            params: {
              name: match.community,
            },
            pathname: '/communities/[name]',
          })

          return
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
    openInApp,
    openInBrowser,
    visible,
  }
}

// https://amp.reddit.com/user/mildpanda/m/js // user:mildpanda, feed:js
// https://www.reddit.com/user/mildpanda/comments/1i7h986/three_images/ // user:mildpanda, postId: 1i7h986
// https://www.reddit.com/user/mildpanda/comments/1i7h986/comment/mcv3hr9/ // user:mildpanda, postId:1i7h986, commentId:mcv3hr9
// https://i.reddit.com/r/acornblue/ // community:acornblue
// https://www.reddit.com/r/macgaming/comments/1jeumij/well_i_did_it_preorder_ac_shadows/ // community:macgaming, postId:1jeumij
// https://www.reddit.com/r/live/comments/1dtm4eq/comment/lvn4wgx/ // community:live, postId:1dtm4eq, commentId:lvn4wgx
// https://www.reddit.com/r/macgaming/wiki/faq/ // community:macgaming, wiki:faq
// https://www.reddit.com/r/wow/s/gT8f86WL7A // community:wow, shareId:gT8f86WL7A
// https://www.reddit.com/live/18hnzysb1elcs // liveId: 18hnzysb1elcs

export function parseLink(url: string): Nullable<{
  commentId?: string
  community?: string
  feed?: string
  liveId?: string
  postId?: string
  shareId?: string
  user?: string
  wiki?: string
}> {
  const regex =
    /reddit\.com(?:\/user\/(?<user>[^/]+)(?:\/m\/(?<feed>[^/]+)|\/comments\/(?<postId>[^/]+)(?:\/comment\/(?<commentId>[^/]+))?)?|\/r\/(?<community>[^/]+)(?:\/comments\/(?<communityPostId>[^/]+)(?:\/comment\/(?<communityCommentId>[^/]+))?|\/wiki\/(?<wiki>[^/]+)|\/s\/(?<shareId>[^/]+))?|\/live\/(?<liveId>[^/]+))/i

  const match = regex.exec(url)

  if (!match?.groups) {
    return null
  }

  const result = Object.fromEntries(
    Object.entries(match.groups).filter(
      ([key, value]: [string, Undefined<string>]) =>
        value !== undefined &&
        key !== 'communityPostId' &&
        key !== 'communityCommentId',
    ),
  )

  if (match.groups.communityPostId) {
    result.postId = match.groups.communityPostId
  }

  if (match.groups.communityCommentId) {
    result.commentId = match.groups.communityCommentId
  }

  return result
}
