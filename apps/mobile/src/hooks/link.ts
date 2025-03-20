import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useState } from 'react'
import { useStyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'
import { type Nullable } from '~/types'

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

        const parts = parseLink(url.toString())

        if (parts?.shareId) {
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

        if (parts?.postId) {
          router.push({
            params: {
              commentId: parts.commentId,
              id: parts.postId,
            },
            pathname: '/posts/[id]',
          })

          return
        }

        if (parts?.feed) {
          router.push({
            params: {
              feed: parts.feed,
            },
            pathname: '/',
          })

          return
        }

        if (parts?.user) {
          router.push({
            params: {
              name: parts.user,
            },
            pathname: '/users/[name]',
          })

          return
        }

        if (parts?.community) {
          router.push({
            params: {
              name: parts.community,
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

// 'https://amp.reddit.com/user/mildpanda/m/js', // user:mildpanda, feed:js
// 'https://www.reddit.com/user/mildpanda/comments/1i7h986/three_images/', // user:mildpanda, postId: 1i7h986
// 'https://www.reddit.com/user/mildpanda/comments/1i7h986/comment/mcv3hr9/', // user:mildpanda, postId:1i7h986, commentId:mcv3hr9
// 'https://www.reddit.com/user/mildpanda/comments/1i7h986/comment/mcv3hr9/?context=3', // user:mildpanda, postId:1i7h986, commentId:mcv3hr9, context:3
// 'https://i.reddit.com/r/acornblue/', // community:acornblue
// 'https://www.reddit.com/r/macgaming/comments/1jeumij/well_i_did_it_preorder_ac_shadows/', // community:macgaming, postId:1jeumij
// 'https://www.reddit.com/r/live/comments/1dtm4eq/comment/lvn4wgx/', // community:live, postId:1dtm4eq, commentId:lvn4wgx
// 'https://www.reddit.com/r/macgaming/wiki/faq/', // community:macgaming, wiki:faq
// 'https://www.reddit.com/r/wow/s/gT8f86WL7A', // community:wow, shareId:gT8f86WL7A
// 'https://www.reddit.com/live/18hnzysb1elcs', // liveId: 18hnzysb1elcs
// 'https://www.reddit.com/r/acornblue/comments/1gdy1c4/join_us_on_discord/mh8vxwr/', // community:acornblue, postId:1gdy1c4, commentId:mh8vxwr, context:3

export function parseLink(url: string): Nullable<{
  commentId?: string
  community?: string
  context?: string
  feed?: string
  liveId?: string
  postId?: string
  shareId?: string
  user?: string
  wiki?: string
}> {
  const regex =
    /^(?:https?:\/\/)?(?:www\.|amp\.|i\.)?reddit\.com\/(?:user\/([^/]+)(?:\/m\/([^/]+)|\/comments\/([^/]+)(?:\/comment\/([^/]+))?(?:\/\?context=(\d+))?)?|r\/([^/]+)(?:\/comments\/([^/]+)(?:\/[^/]+(?:\/([^/]+))?(?:\/\?context=(\d+))?)?|\/s\/([^/]+)(?:\?context=(\d+))?|\/wiki\/([^/]+))?|live\/([^/]+)(?:\?context=(\d+))?)/i

  const match = regex.exec(url)

  if (!match) {
    return null
  }

  const [
    ,
    user,
    feed,
    userPostId,
    userCommentId,
    userContext,
    community,
    communityPostId,
    communityCommentId,
    communityContext,
    shareId,
    shareContext,
    wiki,
    liveId,
    liveContext,
  ] = match

  return {
    commentId: userCommentId ?? communityCommentId,
    community,
    context: userContext ?? communityContext ?? shareContext ?? liveContext,
    feed,
    liveId,
    postId: userPostId ?? communityPostId,
    shareId,
    user,
    wiki,
  }
}
