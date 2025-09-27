import { Link, useRouter } from 'expo-router'
import { Fragment, type ReactNode } from 'react'
import { Alert, Share } from 'react-native'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentRemove } from '~/hooks/mutations/comments/remove'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { htmlToMarkdown } from '~/lib/editor'
import { getIcon } from '~/lib/icons'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type CommentReply } from '~/types/comment'

type Props = {
  children: ReactNode
  comment: CommentReply
}

export function CommentMenu({ children, comment }: Props) {
  const router = useRouter()

  const { accountId } = useAuth()
  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { remove } = useCommentRemove()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()

  return (
    <Link
      asChild
      href={{
        params: {
          commentId: comment.id,
          id: comment.post.id,
        },
        pathname: '/posts/[id]',
      }}
      onPress={(event) => {
        event.preventDefault()
      }}
    >
      <Link.Trigger>{children}</Link.Trigger>

      <Link.Menu>
        <Link.Menu displayAsPalette displayInline>
          <Link.MenuAction
            icon={getIcon(comment.liked ? 'upvote.fill' : 'upvote')}
            onPress={() => {
              vote({
                commentId: comment.id,
                direction: comment.liked ? 0 : 1,
                postId: comment.post.id,
              })
            }}
            title={t(comment.liked ? 'removeUpvote' : 'upvote')}
          />

          <Link.MenuAction
            icon={getIcon(
              comment.liked === false ? 'downvote.fill' : 'downvote',
            )}
            onPress={() => {
              vote({
                commentId: comment.id,
                direction: comment.liked === false ? 0 : -1,
                postId: comment.post.id,
              })
            }}
            title={t(comment.liked === false ? 'removeDownvote' : 'downvote')}
          />

          <Link.MenuAction
            icon={comment.saved ? 'bookmark.fill' : 'bookmark'}
            onPress={() => {
              save({
                action: comment.saved ? 'unsave' : 'save',
                commentId: comment.id,
                postId: comment.post.id,
              })
            }}
            title={t(comment.saved ? 'unsave' : 'save')}
          />

          <Link.MenuAction
            icon="arrowshape.turn.up.backward"
            onPress={() => {
              router.push({
                params: {
                  commentId: comment.id,
                  id: comment.post.id,
                  user: comment.user.name,
                },
                pathname: '/posts/[id]/reply',
              })
            }}
            title={t('reply')}
          />
        </Link.Menu>

        {comment.user.name === accountId ? (
          <Link.Menu displayInline>
            <Link.MenuAction
              icon="square.and.pencil"
              onPress={() => {
                router.push({
                  params: {
                    body: comment.body,
                    commentId: comment.id,
                    id: comment.post.id,
                    user: comment.user.name,
                  },
                  pathname: '/posts/[id]/reply',
                })
              }}
              title={t('editComment')}
            />

            <Link.MenuAction
              destructive
              icon="trash"
              onPress={() => {
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
              }}
              title={t('deleteComment.title')}
            />
          </Link.Menu>
        ) : (
          <Fragment />
        )}

        <Link.Menu displayInline>
          <Link.MenuAction
            icon="square.on.square"
            onPress={() => {
              copy(htmlToMarkdown(comment.body)).then(() => {
                toast.success(t('toast.textCopied'))
              })
            }}
            title={t('copyText')}
          />

          <Link.MenuAction
            icon="square.on.square"
            onPress={() => {
              const url = new URL(
                comment.permalink,
                oldReddit ? 'https://old.reddit.com' : 'https://www.reddit.com',
              )

              copy(url.toString()).then(() => {
                toast.success(t('toast.linkCopied'))
              })
            }}
            title={t('copyPermalink')}
          />

          <Link.MenuAction
            icon="square.and.arrow.up"
            onPress={() => {
              const url = new URL(
                comment.permalink,
                oldReddit ? 'https://old.reddit.com' : 'https://www.reddit.com',
              )

              Share.share({
                url: url.toString(),
              })
            }}
            title={t('sharePermalink')}
          />
        </Link.Menu>

        <Link.Menu displayInline>
          <Link.MenuAction
            onPress={() => {
              handleLink(comment.permalink)
            }}
            title={t('openApp')}
          />

          <Link.MenuAction
            icon="safari"
            onPress={() => {
              const url = new URL(
                comment.permalink,
                oldReddit ? 'https://old.reddit.com' : 'https://www.reddit.com',
              )

              openInBrowser(url.toString())
            }}
            title={t('openBrowser')}
          />
        </Link.Menu>

        <Link.Menu displayInline>
          <Link.MenuAction
            icon="person"
            onPress={() => {
              router.push({
                params: {
                  name: comment.user.name,
                },
                pathname: '/users/[name]',
              })
            }}
            title={t('openUser', {
              user: comment.user.name,
            })}
          />

          {comment.community.name.startsWith('u_') ? (
            <Fragment />
          ) : (
            <Link.MenuAction
              icon="person.2"
              onPress={() => {
                router.push({
                  params: {
                    name: comment.community.name,
                  },
                  pathname: '/communities/[name]',
                })
              }}
              title={t('openCommunity', {
                community: comment.community.name,
              })}
            />
          )}
        </Link.Menu>

        <Link.Menu displayInline>
          <Link.MenuAction
            destructive
            icon="eye.slash"
            onPress={() => {
              hide({
                action: 'hide',
                id: comment.id,
                postId: comment.post.id,
                type: 'comment',
              })
            }}
            title={t('hideComment')}
          />

          <Link.MenuAction
            destructive
            icon="person"
            onPress={() => {
              if (comment.user.id) {
                hide({
                  action: 'hide',
                  id: comment.user.id,
                  name: comment.user.name,
                  type: 'user',
                })
              }
            }}
            title={t('hideUser', {
              user: comment.user.name,
            })}
          />
        </Link.Menu>

        <Link.Menu destructive title={t('report.title')}>
          {reasons
            .filter((reason) =>
              reason === 'community'
                ? !comment.community.name.startsWith('u_')
                : true,
            )
            .map((item) => (
              <Link.MenuAction
                destructive
                key={item}
                onPress={() => {
                  report({
                    id: comment.id,
                    reason: item,
                    type: 'post',
                  })
                }}
                title={t(`report.${item}`, {
                  community: comment.community.name,
                })}
              />
            ))}
        </Link.Menu>
      </Link.Menu>
    </Link>
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
