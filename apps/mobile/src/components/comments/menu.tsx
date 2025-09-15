import { usePathname, useRouter } from 'expo-router'
import { compact } from 'lodash'
import { type ReactNode, useEffect, useRef } from 'react'
import { Alert, Share } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { ContextMenu, type ContextMenuRef } from '@/context-menu'
// import acorn from '~/assets/images/acorn.png'
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

type Props = {
  children: ReactNode
  comment: CommentReply
  onPress: () => void
}

export function CommentMenu({ children, comment, onPress }: Props) {
  const router = useRouter()
  const path = usePathname()

  const { accountId } = useAuth()
  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')
  const a11y = useTranslations('a11y')

  const { theme } = useUnistyles()

  const menu = useRef<ContextMenuRef>(null)

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { remove } = useCommentRemove()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()

  useEffect(() => {
    if (path) {
      menu.current?.hide()
    }
  }, [path])

  return (
    <ContextMenu
      accessibilityLabel={a11y('commentMenu')}
      onPressPreview={onPress}
      options={compact([
        {
          id: 'main',
          inline: true,
          options: [
            {
              color: theme.colors.orange.accent,
              icon: comment.liked ? 'arrowshape.up.fill' : 'arrowshape.up',
              id: 'upvote',
              onPress() {
                vote({
                  commentId: comment.id,
                  direction: comment.liked ? 0 : 1,
                  postId: comment.post.id,
                })
              },
              title: t(comment.liked ? 'removeUpvote' : 'upvote'),
            },
            {
              color: theme.colors.violet.accent,
              icon:
                comment.liked === false
                  ? 'arrowshape.down.fill'
                  : 'arrowshape.down',
              id: 'downvote',
              onPress() {
                vote({
                  commentId: comment.id,
                  direction: comment.liked === false ? 0 : -1,
                  postId: comment.post.id,
                })
              },
              title: t(comment.liked === false ? 'removeDownvote' : 'downvote'),
            },
            {
              color: theme.colors.green.accent,
              icon: comment.saved ? 'bookmark.fill' : 'bookmark',
              id: 'save',
              onPress() {
                save({
                  action: comment.saved ? 'unsave' : 'save',
                  commentId: comment.id,
                  postId: comment.post.id,
                })
              },
              title: t(comment.saved ? 'unsave' : 'save'),
            },
            {
              color: theme.colors.blue.accent,
              icon: 'arrow.turn.up.left',
              id: 'reply',
              onPress() {
                router.push({
                  params: {
                    commentId: comment.id,
                    id: comment.post.id,
                    user: comment.user.name,
                  },
                  pathname: '/posts/[id]/reply',
                })
              },
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
              icon: 'square.and.pencil',
              id: 'edit',
              onPress() {
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
              title: t('editComment'),
            },
            {
              color: theme.colors.red.accent,
              destructive: true,
              icon: 'trash',
              id: 'delete',
              onPress() {
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
              icon: 'square.on.square',
              id: 'copyText',
              onPress() {
                copy(htmlToMarkdown(comment.body)).then(() => {
                  toast.success(t('toast.textCopied'))
                })
              },
              title: t('copyText'),
            },
            {
              icon: 'square.on.square',
              id: 'copyPermalink',
              onPress() {
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
              title: t('copyPermalink'),
            },
            {
              icon: 'square.and.arrow.up',
              id: 'sharePermalink',
              onPress() {
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
              id: 'openApp',
              // image: acorn,
              onPress() {
                handleLink(comment.permalink)
              },
              title: t('openApp'),
            },
            {
              icon: 'safari',
              id: 'openBrowser',
              onPress() {
                const url = new URL(
                  comment.permalink,
                  oldReddit
                    ? 'https://old.reddit.com'
                    : 'https://www.reddit.com',
                )

                openInBrowser(url.toString())
              },
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
              icon: 'person',
              id: 'openUser',
              onPress() {
                router.push({
                  params: {
                    name: comment.user.name,
                  },
                  pathname: '/users/[name]',
                })
              },
              title: t('openUser', {
                user: comment.user.name,
              }),
            },
            !comment.community.name.startsWith('u/') && {
              icon: 'person.2',
              id: 'openCommunity',
              onPress() {
                router.push({
                  params: {
                    name: comment.community.name,
                  },
                  pathname: '/communities/[name]',
                })
              },
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
              color: theme.colors.red.accent,
              destructive: true,
              icon: 'eye.slash',
              id: 'hideComment',
              onPress() {
                hide({
                  action: 'hide',
                  id: comment.id,
                  postId: comment.post.id,
                  type: 'comment',
                })
              },
              title: t('hideComment'),
            },
            {
              color: theme.colors.red.accent,
              destructive: true,
              icon: 'person',
              id: 'hideUser',
              onPress() {
                if (comment.user.id) {
                  hide({
                    action: 'hide',
                    id: comment.user.id,
                    name: comment.user.name,
                    type: 'user',
                  })
                }
              },
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
              id: `report.${item}`,
              onPress() {
                report({
                  id: comment.id,
                  reason: item,
                  type: 'post',
                })
              },
              title: t(`report.${item}`, {
                community: comment.community.name,
              }),
            })),
          title: t('report.title'),
        },
      ])}
      ref={menu}
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
