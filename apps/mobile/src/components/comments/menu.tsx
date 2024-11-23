import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { Share, type StyleProp, type ViewStyle } from 'react-native'
import { ContextMenuView } from 'react-native-ios-context-menu'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { menu } from '~/assets/menu'
import { useCopy } from '~/hooks/copy'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { type CommentReply } from '~/types/comment'

type Props = {
  children: ReactNode
  comment: CommentReply
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export function CommentMenu({ children, comment, onPress, style }: Props) {
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
    <ContextMenuView
      menuConfig={{
        menuItems: [
          {
            actionKey: 'upvote',
            actionTitle: t(comment.liked ? 'removeUpvote' : 'upvote'),
            icon: {
              imageOptions: {
                tint: theme.colors.orange[9],
              },
              imageValue: menu.arrowFatUp,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            actionKey: 'downvote',
            actionTitle: t(
              comment.liked === false ? 'removeDownvote' : 'downvote',
            ),
            icon: {
              imageOptions: {
                tint: theme.colors.violet[9],
              },
              imageValue: menu.arrowFatDown,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            actionKey: 'save',
            actionTitle: t(comment.saved ? 'unsave' : 'save'),
            icon: {
              imageOptions: {
                tint: theme.colors.green[9],
              },
              imageValue: menu.bookmarkSimple,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            actionKey: 'reply',
            actionTitle: t('reply'),
            icon: {
              imageOptions: {
                tint: theme.colors.blue[9],
              },
              imageValue: menu.arrowBendUpLeft,
              type: 'IMAGE_REQUIRE',
            },
          },
          {
            menuItems: [
              {
                actionKey: 'share',
                actionTitle: t('share'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.export,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'copyLink',
                actionTitle: t('copyLink'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.copy,
                  type: 'IMAGE_REQUIRE',
                },
              },
            ],
            menuOptions: ['displayInline'],
            menuTitle: '',
            type: 'menu',
          },
          {
            menuItems: [
              {
                actionKey: 'hideComment',
                actionTitle: t('hideComment'),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.eyeClosed,
                  type: 'IMAGE_REQUIRE',
                },
              },
              {
                actionKey: 'hideUser',
                actionTitle: t('hideUser', {
                  user: comment.user.name,
                }),
                icon: {
                  imageOptions: {
                    tint: theme.colors.gray[12],
                  },
                  imageValue: menu.user,
                  type: 'IMAGE_REQUIRE',
                },
              },
            ],
            menuOptions: ['displayInline'],
            menuTitle: '',
            type: 'menu',
          },
          {
            menuItems: reasons.map((reason) => ({
              actionKey: reason,
              actionTitle: t(`report.${reason}`),
            })),
            menuOptions: ['destructive'],
            menuTitle: t('report.title'),
            type: 'menu',
          },
        ],
        menuTitle: t('title.comment'),
      }}
      onPressMenuItem={(event) => {
        if (event.nativeEvent.actionKey === 'upvote') {
          vote({
            commentId: comment.id,
            direction: comment.liked ? 0 : 1,
            postId: comment.postId,
          })
        }

        if (event.nativeEvent.actionKey === 'downvote') {
          vote({
            commentId: comment.id,
            direction: comment.liked === false ? 0 : -1,
            postId: comment.postId,
          })
        }

        if (event.nativeEvent.actionKey === 'reply') {
          router.navigate({
            params: {
              commentId: comment.id,
              id: comment.postId,
              user: comment.user.name,
            },
            pathname: '/posts/[id]/reply',
          })
        }

        if (event.nativeEvent.actionKey === 'save') {
          save({
            action: comment.saved ? 'unsave' : 'save',
            commentId: comment.id,
            postId: comment.postId,
          })
        }

        if (event.nativeEvent.actionKey === 'share') {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void Share.share({
            url: url.toString(),
          })
        }

        if (event.nativeEvent.actionKey === 'copyLink') {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void copy(url.toString())
        }

        if (event.nativeEvent.actionKey === 'hideComment') {
          hide({
            action: 'hide',
            id: comment.id,
            postId: comment.postId,
            type: 'comment',
          })
        }

        if (event.nativeEvent.actionKey === 'hideUser' && comment.user.id) {
          hide({
            action: 'hide',
            id: comment.user.id,
            type: 'user',
          })
        }

        if (reasons.includes(event.nativeEvent.actionKey as ReportReason)) {
          report({
            id: comment.id,
            postId: comment.postId,
            reason: event.nativeEvent.actionKey as ReportReason,
            type: 'comment',
          })
        }
      }}
      onPressMenuPreview={() => {
        onPress()
      }}
      style={style}
    >
      {children}
    </ContextMenuView>
  )
}
