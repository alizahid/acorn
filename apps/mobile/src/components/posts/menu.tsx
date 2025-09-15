import { useFocusEffect, usePathname, useRouter } from 'expo-router'
import { compact } from 'lodash'
import { type ReactNode, useCallback, useRef } from 'react'
import { Alert, Share } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { ContextMenu, type ContextMenuRef } from '@/context-menu'
// import acorn from '~/assets/images/acorn.png'
import { useCopy } from '~/hooks/copy'
import { useDownloadImages } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { usePostRemove } from '~/hooks/mutations/posts/remove'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { htmlToMarkdown } from '~/lib/editor'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

type Props = {
  children: ReactNode
  onPress: () => void
  post: Post
}

export function PostMenu({ children, onPress, post }: Props) {
  const router = useRouter()
  const path = usePathname()

  const { accountId } = useAuth()
  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')
  const a11y = useTranslations('a11y')

  const { theme } = useUnistyles()

  const menu = useRef<ContextMenuRef>(null)

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()
  const { remove } = usePostRemove()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()
  const { download } = useDownloadImages()

  useFocusEffect(
    useCallback(() => {
      return () => {
        menu.current?.hide()
      }
    }, []),
  )

  return (
    <ContextMenu
      accessibilityLabel={a11y('postMenu')}
      onPressPreview={onPress}
      options={compact([
        {
          id: 'main',
          inline: true,
          options: [
            {
              color: theme.colors.orange.accent,
              icon: post.liked ? 'arrowshape.up.fill' : 'arrowshape.up',
              id: 'upvote',
              onPress() {
                vote({
                  direction: post.liked ? 0 : 1,
                  postId: post.id,
                })
              },
              title: t(post.liked ? 'removeUpvote' : 'upvote'),
            },
            {
              color: theme.colors.violet.accent,
              icon:
                post.liked === false
                  ? 'arrowshape.down.fill'
                  : 'arrowshape.down',
              id: 'downvote',
              onPress() {
                vote({
                  direction: post.liked === false ? 0 : -1,
                  postId: post.id,
                })
              },
              title: t(post.liked === false ? 'removeDownvote' : 'downvote'),
            },
            {
              color: theme.colors.green.accent,
              icon: post.saved ? 'bookmark.fill' : 'bookmark',
              id: 'save',
              onPress() {
                save({
                  action: post.saved ? 'unsave' : 'save',
                  postId: post.id,
                })
              },
              title: t(post.saved ? 'unsave' : 'save'),
            },
            {
              color: theme.colors.blue.accent,
              icon: 'arrow.turn.up.left',
              id: 'reply',
              onPress() {
                router.push({
                  params: {
                    id: post.id,
                  },
                  pathname: '/posts/[id]/reply',
                })
              },
              title: t('reply'),
            },
          ],
          title: '',
        },
        post.user.name === accountId && {
          color: theme.colors.red.accent,
          destructive: true,
          icon: 'trash',
          id: 'delete',
          onPress() {
            Alert.alert(t('deletePost.title'), t('deletePost.description'), [
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
            ])
          },
          title: t('deletePost.title'),
        },
        {
          id: 'copy',
          inline: true,
          options: compact([
            {
              icon: 'square.on.square',
              id: 'copyTitle',
              onPress() {
                copy(post.title).then(() => {
                  toast.success(t('toast.titleCopied'))
                })
              },
              title: t('copyTitle'),
            },
            post.body?.length && {
              icon: 'square.on.square',
              id: 'copyText',
              onPress() {
                if (post.body) {
                  copy(htmlToMarkdown(post.body)).then(() => {
                    toast.success(t('toast.textCopied'))
                  })
                }
              },
              title: t('copyText'),
            },
            {
              icon: 'square.on.square',
              id: 'copyPermalink',
              onPress() {
                const url = new URL(
                  post.permalink,
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
                  post.permalink,
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
            (post.media.images?.length ?? 0) > 1 && {
              icon: 'square.and.arrow.down',
              id: 'downloadGallery',
              onPress() {
                if (post.media.images?.length) {
                  download({
                    urls: post.media.images.map((image) => image.url),
                  })
                }
              },
              title: t('downloadGallery'),
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
                handleLink(post.permalink)
              },
              title: t('openApp'),
            },
            {
              icon: 'safari',
              id: 'openBrowser',
              onPress() {
                const url = new URL(
                  post.permalink,
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
                    name: post.user.name,
                  },
                  pathname: '/users/[name]',
                })
              },
              title: t('openUser', {
                user: post.user.name,
              }),
            },
            !post.community.name.startsWith('u/') && {
              icon: 'person.2',
              id: 'openCommunity',
              onPress() {
                router.push({
                  params: {
                    name: post.community.name,
                  },
                  pathname: '/communities/[name]',
                })
              },
              title: t('openCommunity', {
                community: post.community.name,
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
              id: 'hidePost',
              onPress() {
                hide({
                  action: post.hidden ? 'unhide' : 'hide',
                  id: post.id,
                  type: 'post',
                })
              },
              title: t('hidePost'),
            },
            {
              color: theme.colors.red.accent,
              destructive: true,
              icon: 'person',
              id: 'hideUser',
              onPress() {
                if (post.user.id) {
                  hide({
                    action: 'hide',
                    id: post.user.id,
                    name: post.user.name,
                    type: 'user',
                  })
                }
              },
              title: t('hideUser', {
                user: post.user.name,
              }),
            },
            !post.community.name.startsWith('u/') && {
              color: theme.colors.red.accent,
              destructive: true,
              icon: 'person.2',
              id: 'hideCommunity',
              onPress() {
                hide({
                  action: 'hide',
                  id: post.community.id,
                  name: post.community.name,
                  type: 'community',
                })
              },
              title: t('hideCommunity', {
                community: post.community.name,
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
                ? !post.community.name.startsWith('u/')
                : true,
            )
            .map((item) => ({
              id: `report.${item}`,
              onPress() {
                report({
                  id: post.id,
                  reason: item,
                  type: 'post',
                })
              },
              title: t(`report.${item}`, {
                community: post.community.name,
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
