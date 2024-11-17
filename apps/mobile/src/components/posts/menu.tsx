import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

type Props = {
  children: ReactNode
  post: Post
}

export function PostMenu({ children, post }: Props) {
  const router = useRouter()

  const t = useTranslations('component.posts.menu')

  const { theme } = useStyles()

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()

  const reasons: Array<ReportReason> = [
    'community',
    'HARASSMENT',
    'VIOLENCE',
    'HATE_CONTENT',
    'MINOR_ABUSE_OR_SEXUALIZATION',
    'PII',
    'INVOLUNTARY_PORN',
    'PROHIBITED_SALES',
    'IMPERSONATION',
    'COPYRIGHT',
    'TRADEMARK',
    'SELF_HARM',
    'SPAM',
    'CONTRIBUTOR_PROGRAM',
  ]

  return (
    <MenuView
      actions={[
        {
          id: 'upvote',
          image: 'arrow-fat-up-duotone',
          imageColor: theme.colors.orange.a9,
          title: t(post.liked ? 'removeUpvote' : 'upvote'),
        },
        {
          id: 'downvote',
          image: 'arrow-fat-down-duotone',
          imageColor: theme.colors.violet.a9,
          title: t(post.liked === false ? 'removeDownvote' : 'downvote'),
        },
        {
          id: 'save',
          image: 'bookmark-simple-duotone',
          imageColor: theme.colors.green.a9,
          title: t(post.saved ? 'unsave' : 'save'),
        },
        {
          id: 'reply',
          image: 'arrow-bend-up-left-duotone',
          imageColor: theme.colors.blue.a9,
          title: t('reply'),
        },
        {
          displayInline: true,
          subactions: [
            {
              id: 'share',
              image: 'export-duotone',
              imageColor: theme.colors.accent.a9,
              title: t('share'),
            },
            {
              id: 'copyLink',
              image: 'copy-duotone',
              imageColor: theme.colors.accent.a9,
              title: t('copyLink'),
            },
          ],
          title: '',
        },
        {
          image: 'flag-duotone',
          imageColor: theme.colors.accent.a9,
          subactions: reasons.map((reason) => ({
            id: reason,
            title: t(`report.${reason}`, {
              community: post.community.name,
            }),
          })),
          title: t('report.title'),
        },
        {
          displayInline: true,
          subactions: [
            {
              id: 'hidePost',
              image: post.hidden ? 'eye-duotone' : 'eye-closed-duotone',
              imageColor: theme.colors.accent.a9,
              title: t(post.hidden ? 'unhidePost' : 'hidePost'),
            },
            {
              id: 'hideUser',
              image: 'user-duotone',
              imageColor: theme.colors.accent.a9,
              title: t('hideUser', {
                user: post.user.name,
              }),
            },
            {
              id: 'hideCommunity',
              image: 'users-four-duotone',
              imageColor: theme.colors.accent.a9,
              title: t('hideCommunity', {
                community: post.community.name,
              }),
            },
          ],
          title: '',
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        if (nativeEvent.event === 'update') {
          vote({
            direction: post.liked ? 0 : 1,
            postId: post.id,
          })
        }

        if (nativeEvent.event === 'downvote') {
          vote({
            direction: post.liked === false ? 0 : -1,
            postId: post.id,
          })
        }

        if (nativeEvent.event === 'reply') {
          router.navigate({
            params: {
              id: post.id,
            },
            pathname: '/posts/[id]/reply',
          })
        }

        if (nativeEvent.event === 'save') {
          save({
            action: post.saved ? 'unsave' : 'save',
            postId: post.id,
          })
        }

        if (nativeEvent.event === 'share') {
          const url = new URL(post.permalink, 'https://reddit.com')

          void Share.share({
            message: post.title,
            url: url.toString(),
          })
        }

        if (nativeEvent.event === 'copyLink') {
          const url = new URL(post.permalink, 'https://reddit.com')

          void copy(url.toString())
        }

        if (nativeEvent.event === 'hidePost') {
          hide({
            action: post.hidden ? 'unhide' : 'hide',
            id: post.id,
            type: 'post',
          })
        }

        if (nativeEvent.event === 'hideUser') {
          hide({
            action: 'hide',
            id: post.user.id,
            type: 'user',
          })
        }

        if (nativeEvent.event === 'hideCommunity') {
          hide({
            action: 'hide',
            id: post.community.id,
            type: 'community',
          })
        }

        if (reasons.includes(nativeEvent.event as ReportReason)) {
          report({
            id: post.id,
            reason: nativeEvent.event as ReportReason,
            type: 'post',
          })
        }
      }}
      title={t('title.post')}
    >
      {children}
    </MenuView>
  )
}
