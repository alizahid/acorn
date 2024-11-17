import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { type CommentReply } from '~/types/comment'

type Props = {
  children: ReactNode
  comment: CommentReply
}

export function CommentMenu({ children, comment }: Props) {
  const router = useRouter()

  const t = useTranslations('component.posts.menu')

  const { theme } = useStyles()

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()

  const reasons: Array<ReportReason> = [
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
          title: t(comment.liked ? 'removeUpvote' : 'upvote'),
        },
        {
          id: 'downvote',
          image: 'arrow-fat-down-duotone',
          imageColor: theme.colors.violet.a9,
          title: t(comment.liked === false ? 'removeDownvote' : 'downvote'),
        },
        {
          id: 'save',
          image: 'bookmark-simple-duotone',
          imageColor: theme.colors.green.a9,
          title: t(comment.saved ? 'unsave' : 'save'),
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
            title: t(`report.${reason}`),
          })),
          title: t('report.title'),
        },
        {
          displayInline: true,
          subactions: [
            {
              id: 'hideComment',
              image: 'eye-closed-duotone',
              imageColor: theme.colors.accent.a9,
              title: t('hideComment'),
            },
            {
              id: 'hideUser',
              image: 'user-duotone',
              imageColor: theme.colors.accent.a9,
              title: t('hideUser', {
                user: comment.user.name,
              }),
            },
          ],
          title: '',
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        if (nativeEvent.event === 'update') {
          vote({
            commentId: comment.id,
            direction: comment.liked ? 0 : 1,
            postId: comment.postId,
          })
        }

        if (nativeEvent.event === 'downvote') {
          vote({
            commentId: comment.id,
            direction: comment.liked === false ? 0 : -1,
            postId: comment.postId,
          })
        }

        if (nativeEvent.event === 'reply') {
          router.navigate({
            params: {
              commentId: comment.id,
              id: comment.postId,
              user: comment.user.name,
            },
            pathname: '/posts/[id]/reply',
          })
        }

        if (nativeEvent.event === 'save') {
          save({
            action: comment.saved ? 'unsave' : 'save',
            commentId: comment.id,
            postId: comment.postId,
          })
        }

        if (nativeEvent.event === 'share') {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void Share.share({
            url: url.toString(),
          })
        }

        if (nativeEvent.event === 'copyLink') {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void copy(url.toString())
        }

        if (nativeEvent.event === 'hideComment') {
          hide({
            action: 'hide',
            id: comment.id,
            postId: comment.postId,
            type: 'comment',
          })
        }

        if (nativeEvent.event === 'hideUser' && comment.user.id) {
          hide({
            action: 'hide',
            id: comment.user.id,
            type: 'user',
          })
        }

        if (reasons.includes(nativeEvent.event as ReportReason)) {
          report({
            id: comment.id,
            postId: comment.postId,
            reason: nativeEvent.event as ReportReason,
            type: 'comment',
          })
        }
      }}
      title={t('title.comment')}
    >
      {children}
    </MenuView>
  )
}
