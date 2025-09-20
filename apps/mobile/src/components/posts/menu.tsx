import { Link, usePathname, useRouter } from 'expo-router'
import { Fragment, type ReactNode } from 'react'
import { Alert, Share } from 'react-native'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useDownloadImages } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { usePostRemove } from '~/hooks/mutations/posts/remove'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { htmlToMarkdown } from '~/lib/editor'
import { removePrefix } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

type Props = {
  children: ReactNode
  post: Post
}

export function PostMenu({ children, post }: Props) {
  const router = useRouter()
  const path = usePathname()

  const { accountId } = useAuth()
  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()
  const { remove } = usePostRemove()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()
  const { download } = useDownloadImages()

  return (
    <Link
      asChild
      href={{
        params: {
          id: removePrefix(post.id),
        },
        pathname: '/posts/[id]',
      }}
    >
      <Link.Trigger>{children}</Link.Trigger>

      <Link.Menu>
        <Link.Menu displayAsPalette displayInline>
          <Link.MenuAction
            icon={post.liked ? 'arrowshape.up.fill' : 'arrowshape.up'}
            onPress={() => {
              vote({
                direction: post.liked ? 0 : 1,
                postId: post.id,
              })
            }}
            title={t(post.liked ? 'removeUpvote' : 'upvote')}
          />

          <Link.MenuAction
            icon={
              post.liked === false ? 'arrowshape.down.fill' : 'arrowshape.down'
            }
            onPress={() => {
              vote({
                direction: post.liked === false ? 0 : -1,
                postId: post.id,
              })
            }}
            title={t(post.liked === false ? 'removeDownvote' : 'downvote')}
          />

          <Link.MenuAction
            icon={post.saved ? 'bookmark.fill' : 'bookmark'}
            onPress={() => {
              save({
                action: post.saved ? 'unsave' : 'save',
                postId: post.id,
              })
            }}
            title={t(post.saved ? 'unsave' : 'save')}
          />

          <Link.MenuAction
            icon="arrow.turn.up.left"
            onPress={() => {
              router.push({
                params: {
                  id: post.id,
                },
                pathname: '/posts/[id]/reply',
              })
            }}
            title={t('reply')}
          />
        </Link.Menu>

        <Link.Menu displayInline>
          {post.user.name === accountId ? (
            <Link.MenuAction
              destructive
              icon="trash"
              onPress={() => {
                Alert.alert(
                  t('deletePost.title'),
                  t('deletePost.description'),
                  [
                    {
                      style: 'cancel',
                      text: t('deletePost.no'),
                    },
                    {
                      onPress() {
                        remove({
                          id: post.id,
                        })

                        if (path.startsWith('/posts/')) {
                          router.back()
                        }
                      },
                      style: 'destructive',
                      text: t('deletePost.yes'),
                    },
                  ],
                )
              }}
              title={t('deletePost.title')}
            />
          ) : (
            <Fragment />
          )}

          <Link.MenuAction
            icon="square.on.square"
            onPress={() => {
              copy(post.title).then(() => {
                toast.success(t('toast.titleCopied'))
              })
            }}
            title={t('copyTitle')}
          />

          {post.body?.length ? (
            <Link.MenuAction
              icon="square.on.square"
              onPress={() => {
                if (post.body) {
                  copy(htmlToMarkdown(post.body)).then(() => {
                    toast.success(t('toast.textCopied'))
                  })
                }
              }}
              title={t('copyText')}
            />
          ) : (
            <Fragment />
          )}

          <Link.MenuAction
            icon="square.on.square"
            onPress={() => {
              const url = new URL(
                post.permalink,
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
                post.permalink,
                oldReddit ? 'https://old.reddit.com' : 'https://www.reddit.com',
              )

              Share.share({
                url: url.toString(),
              })
            }}
            title={t('sharePermalink')}
          />

          {(post.media.images?.length ?? 0) > 1 ? (
            <Link.MenuAction
              icon="square.and.arrow.down"
              onPress={() => {
                if (post.media.images?.length) {
                  download({
                    urls: post.media.images.map((image) => image.url),
                  })
                }
              }}
              title={t('downloadGallery')}
            />
          ) : (
            <Fragment />
          )}
        </Link.Menu>

        <Link.Menu displayInline>
          <Link.MenuAction
            onPress={() => {
              handleLink(post.permalink)
            }}
            title={t('openApp')}
          />

          <Link.MenuAction
            icon="safari"
            onPress={() => {
              const url = new URL(
                post.permalink,
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
                  name: post.user.name,
                },
                pathname: '/users/[name]',
              })
            }}
            title={t('openUser', {
              user: post.user.name,
            })}
          />

          {post.community.name.startsWith('u/') ? (
            <Fragment />
          ) : (
            <Link.MenuAction
              icon="person.2"
              onPress={() => {
                router.push({
                  params: {
                    name: post.community.name,
                  },
                  pathname: '/communities/[name]',
                })
              }}
              title={t('openCommunity', {
                community: post.community.name,
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
                action: post.hidden ? 'unhide' : 'hide',
                id: post.id,
                type: 'post',
              })
            }}
            title={t('hidePost')}
          />

          <Link.MenuAction
            destructive
            icon="person"
            onPress={() => {
              if (post.user.id) {
                hide({
                  action: 'hide',
                  id: post.user.id,
                  name: post.user.name,
                  type: 'user',
                })
              }
            }}
            title={t('hideUser', {
              user: post.user.name,
            })}
          />

          {post.community.name.startsWith('u/') ? (
            <Fragment />
          ) : (
            <Link.MenuAction
              destructive
              icon="person.2"
              onPress={() => {
                hide({
                  action: 'hide',
                  id: post.community.id,
                  name: post.community.name,
                  type: 'community',
                })
              }}
              title={t('hideCommunity', {
                community: post.community.name,
              })}
            />
          )}
        </Link.Menu>

        <Link.Menu destructive title={t('report.title')}>
          {reasons
            .filter((reason) =>
              reason === 'community'
                ? !post.community.name.startsWith('u/')
                : true,
            )
            .map((item) => (
              <Link.MenuAction
                destructive
                key={item}
                onPress={() => {
                  report({
                    id: post.id,
                    reason: item,
                    type: 'post',
                  })
                }}
                title={t(`report.${item}`, {
                  community: post.community.name,
                })}
              />
            ))}
        </Link.Menu>
      </Link.Menu>
    </Link>
  )
}

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
