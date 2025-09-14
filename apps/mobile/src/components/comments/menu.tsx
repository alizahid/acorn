import { useRouter } from 'expo-router'
import { compact } from 'lodash'
import { type ReactNode } from 'react'
import { Alert, Share } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
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
import { htmlToMarkdown } from '~/lib/editor'
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

  const { theme } = useUnistyles()

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
                name: comment.liked ? 'arrowshape.up.fill' : 'arrowshape.up',
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
                name:
                  comment.liked === false
                    ? 'arrowshape.down.fill'
                    : 'arrowshape.down',
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
                name: comment.saved ? 'bookmark.fill' : 'bookmark',
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
                name: 'arrow.turn.up.left',
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
                name: 'square.and.pencil',
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
                name: 'trash',
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
                copy(htmlToMarkdown(comment.body)).then(() => {
                  toast.success(t('toast.textCopied'))
                })
              },
              icon: {
                name: 'square.on.square',
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

                copy(url.toString()).then(() => {
                  toast.success(t('toast.linkCopied'))
                })
              },
              icon: {
                name: 'square.on.square',
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

                Share.share({
                  url: url.toString(),
                })
              },
              icon: {
                name: 'square.and.arrow.up',
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
                handleLink(comment.permalink)
              },
              icon: {
                image: acorn,
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
                name: 'safari',
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
                name: 'person',
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
                name: 'person.2',
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
                name: 'eye.slash',
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
                name: 'person',
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
