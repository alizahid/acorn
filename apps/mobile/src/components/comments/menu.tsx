import { useRouter } from 'expo-router'
import { compact } from 'lodash'
import { type ReactNode } from 'react'
import { Alert, Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import acorn from '~/assets/images/acorn.png'
import { useCopy } from '~/hooks/copy'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentRemove } from '~/hooks/mutations/comments/remove'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type CommentReply } from '~/types/comment'

import { ContextMenu } from '../common/context-menu'

type Props = {
  children: ReactNode
  comment: CommentReply
  onPress: () => void
}

export function CommentMenu({ children, comment, onPress }: Props) {
  const router = useRouter()

  const { accountId } = useAuth()
  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')
  const a11y = useTranslations('a11y')

  const { theme } = useStyles()

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { remove } = useCommentRemove()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()

  return (
    <ContextMenu
      label={a11y('commentMenu')}
      onPress={onPress}
      options={compact([
        {
          id: 'main',
          inline: true,
          options: [
            {
              action() {
                vote({
                  commentId: comment.id,
                  direction: comment.liked ? 0 : 1,
                  postId: comment.post.id,
                })
              },
              icon: {
                color: theme.colors.orange.accent,
                name: 'arrow-fat-up-duotone',
                type: 'icon',
              },
              id: 'upvote',
              title: t(comment.liked ? 'removeUpvote' : 'upvote'),
            },
            {
              action() {
                vote({
                  commentId: comment.id,
                  direction: comment.liked === false ? 0 : -1,
                  postId: comment.post.id,
                })
              },
              icon: {
                color: theme.colors.violet.accent,
                name: 'arrow-fat-down-duotone',
                type: 'icon',
              },
              id: 'downvote',
              title: t(comment.liked === false ? 'removeDownvote' : 'downvote'),
            },
            {
              action() {
                save({
                  action: comment.saved ? 'unsave' : 'save',
                  commentId: comment.id,
                  postId: comment.post.id,
                })
              },
              icon: {
                color: theme.colors.green.accent,
                name: 'bookmark-simple-duotone',
                type: 'icon',
              },
              id: 'save',
              title: t(comment.saved ? 'unsave' : 'save'),
            },
            {
              action() {
                router.push({
                  params: {
                    commentId: comment.id,
                    id: comment.post.id,
                    user: comment.user.name,
                  },
                  pathname: '/posts/[id]/reply',
                })
              },
              icon: {
                color: theme.colors.blue.accent,
                name: 'arrow-bend-up-left-duotone',
                type: 'icon',
              },
              id: 'reply',
              title: t('reply'),
            },
          ],
          title: '',
        },
        comment.user.name === accountId && {
          id: 'moderation',
          inline: true,
          options: [
            {
              action() {
                router.push({
                  params: {
                    body: comment.body,
                    commentId: comment.id,
                    id: comment.post.id,
                    postId: comment.post.id,
                  },
                  pathname: '/posts/[id]/reply',
                })
              },
              icon: {
                name: 'pencil-duotone',
                type: 'icon',
              },
              id: 'edit',
              title: t('editComment'),
            },
            {
              action() {
                Alert.alert(
                  t('deleteComment.title'),
                  t('deleteComment.description'),
                  [
                    {
                      style: 'cancel',
                      text: t('deleteComment.no'),
                    },
                    {
                      onPress() {
                        remove({
                          id: comment.id,
                          postId: comment.post.id,
                        })
                      },
                      style: 'destructive',
                      text: t('deleteComment.yes'),
                    },
                  ],
                )
              },
              destructive: true,
              icon: {
                color: theme.colors.red.accent,
                name: 'trash-duotone',
                type: 'icon',
              },
              id: 'delete',
              title: t('deleteComment.title'),
            },
          ],
          title: '',
        },
        {
          id: 'copy',
          inline: true,
          options: compact([
            {
              action() {
                void copy(comment.body).then(() => {
                  toast.success(t('toast.textCopied'))
                })
              },
              icon: {
                name: 'copy-duotone',
                type: 'icon',
              },
              id: 'copyText',
              title: t('copyText'),
            },
            {
              action() {
                const url = new URL(
                  comment.permalink,
                  oldReddit
                    ? 'https://old.reddit.com'
                    : 'https://www.reddit.com',
                )

                void copy(url.toString()).then(() => {
                  toast.success(t('toast.linkCopied'))
                })
              },
              icon: {
                name: 'copy-duotone',
                type: 'icon',
              },
              id: 'copyPermalink',
              title: t('copyPermalink'),
            },
            {
              action() {
                const url = new URL(
                  comment.permalink,
                  oldReddit
                    ? 'https://old.reddit.com'
                    : 'https://www.reddit.com',
                )

                void Share.share({
                  url: url.toString(),
                })
              },
              icon: {
                name: 'share-duotone',
                type: 'icon',
              },
              id: 'sharePermalink',
              title: t('sharePermalink'),
            },
          ]),
          title: '',
        },
        {
          id: 'open',
          inline: true,
          options: [
            {
              action() {
                void handleLink(comment.permalink)
              },
              icon: {
                image: acorn,
                type: 'image',
              },
              id: 'openApp',
              title: t('openApp'),
            },
            {
              action() {
                const url = new URL(
                  comment.permalink,
                  oldReddit
                    ? 'https://old.reddit.com'
                    : 'https://www.reddit.com',
                )

                openInBrowser(url.toString())
              },
              icon: {
                name: 'compass-duotone',
                type: 'icon',
              },
              id: 'openBrowser',
              title: t('openBrowser'),
            },
          ],
          title: '',
        },
        {
          id: 'navigate',
          inline: true,
          options: compact([
            {
              action() {
                router.push({
                  params: {
                    name: comment.user.name,
                  },
                  pathname: '/users/[name]',
                })
              },
              icon: {
                name: 'user-duotone',
                type: 'icon',
              },
              id: 'openUser',
              title: t('openUser', {
                user: comment.user.name,
              }),
            },
            !comment.community.name.startsWith('u/') && {
              action() {
                router.push({
                  params: {
                    name: comment.community.name,
                  },
                  pathname: '/communities/[name]',
                })
              },
              icon: {
                name: 'users-four-duotone',
                type: 'icon',
              },
              id: 'openCommunity',
              title: t('openCommunity', {
                community: comment.community.name,
              }),
            },
          ]),
          title: '',
        },
        {
          id: 'hide',
          inline: true,
          options: compact([
            {
              action() {
                hide({
                  action: 'hide',
                  id: comment.id,
                  postId: comment.post.id,
                  type: 'comment',
                })
              },
              destructive: true,
              icon: {
                color: theme.colors.red.accent,
                name: 'eye-closed-duotone',
                type: 'icon',
              },
              id: 'hideComment',
              title: t('hideComment'),
            },
            {
              action() {
                if (comment.user.id) {
                  hide({
                    action: 'hide',
                    id: comment.user.id,
                    name: comment.user.name,
                    type: 'user',
                  })
                }
              },
              destructive: true,
              icon: {
                color: theme.colors.red.accent,
                name: 'user-duotone',
                type: 'icon',
              },
              id: 'hideUser',
              title: t('hideUser', {
                user: comment.user.name,
              }),
            },
          ]),
          title: '',
        },
        {
          destructive: true,
          id: 'report',
          options: reasons
            .filter((reason) =>
              reason === 'community'
                ? !comment.community.name.startsWith('u/')
                : true,
            )
            .map((item) => ({
              action() {
                report({
                  id: comment.id,
                  reason: item,
                  type: 'post',
                })
              },
              id: `report.${item}`,
              title: t(`report.${item}`, {
                community: comment.community.name,
              }),
            })),
          title: t('report.title'),
        },
      ])}
    >
      {children}
    </ContextMenu>
  )
}

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
