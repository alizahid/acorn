import { usePathname, useRouter } from 'expo-router'
import { compact } from 'lodash'
import { type ReactNode } from 'react'
import { Alert, Share } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import acorn from '~/assets/images/acorn.png'
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

import { ContextMenu } from '../common/context-menu'

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

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()
  const { remove } = usePostRemove()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, openInBrowser } = useLink()
  const { download } = useDownloadImages()

  return (
    <ContextMenu
      label={a11y('postMenu')}
      onPress={onPress}
      options={compact([
        {
          id: 'main',
          inline: true,
          options: [
            {
              action() {
                vote({
                  direction: post.liked ? 0 : 1,
                  postId: post.id,
                })
              },
              icon: {
                color: theme.colors.orange.accent,
                name: 'arrow-fat-up-duotone',
                type: 'icon',
              },
              id: 'upvote',
              title: t(post.liked ? 'removeUpvote' : 'upvote'),
            },
            {
              action() {
                vote({
                  direction: post.liked === false ? 0 : -1,
                  postId: post.id,
                })
              },
              icon: {
                color: theme.colors.violet.accent,
                name: 'arrow-fat-down-duotone',
                type: 'icon',
              },
              id: 'downvote',
              title: t(post.liked === false ? 'removeDownvote' : 'downvote'),
            },
            {
              action() {
                save({
                  action: post.saved ? 'unsave' : 'save',
                  postId: post.id,
                })
              },
              icon: {
                color: theme.colors.green.accent,
                name: 'bookmark-simple-duotone',
                type: 'icon',
              },
              id: 'save',
              title: t(post.saved ? 'unsave' : 'save'),
            },
            {
              action() {
                router.push({
                  params: {
                    id: post.id,
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
        post.user.name === accountId && {
          action() {
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
          destructive: true,
          icon: {
            color: theme.colors.red.accent,
            name: 'trash-duotone',
            type: 'icon',
          },
          id: 'delete',
          title: t('deletePost.title'),
        },
        {
          id: 'copy',
          inline: true,
          options: compact([
            {
              action() {
                copy(post.title).then(() => {
                  toast.success(t('toast.titleCopied'))
                })
              },
              icon: {
                name: 'copy-duotone',
                type: 'icon',
              },
              id: 'copyTitle',
              title: t('copyTitle'),
            },
            post.body?.length && {
              action() {
                if (post.body) {
                  copy(htmlToMarkdown(post.body)).then(() => {
                    toast.success(t('toast.textCopied'))
                  })
                }
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
                  post.permalink,
                  oldReddit
                    ? 'https://old.reddit.com'
                    : 'https://www.reddit.com',
                )

                copy(url.toString()).then(() => {
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
                  post.permalink,
                  oldReddit
                    ? 'https://old.reddit.com'
                    : 'https://www.reddit.com',
                )

                Share.share({
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
            (post.media.images?.length ?? 0) > 1 && {
              action() {
                if (post.media.images?.length) {
                  download({
                    urls: post.media.images.map((image) => image.url),
                  })
                }
              },
              icon: {
                name: 'box-arrow-down-duotone',
                type: 'icon',
              },
              id: 'downloadGallery',
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
              action() {
                handleLink(post.permalink)
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
                  post.permalink,
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
                    name: post.user.name,
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
                user: post.user.name,
              }),
            },
            !post.community.name.startsWith('u/') && {
              action() {
                router.push({
                  params: {
                    name: post.community.name,
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
              action() {
                hide({
                  action: post.hidden ? 'unhide' : 'hide',
                  id: post.id,
                  type: 'post',
                })
              },
              destructive: true,
              icon: {
                color: theme.colors.red.accent,
                name: 'eye-closed-duotone',
                type: 'icon',
              },
              id: 'hidePost',
              title: t('hidePost'),
            },
            {
              action() {
                if (post.user.id) {
                  hide({
                    action: 'hide',
                    id: post.user.id,
                    name: post.user.name,
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
                user: post.user.name,
              }),
            },
            !post.community.name.startsWith('u/') && {
              action() {
                hide({
                  action: 'hide',
                  id: post.community.id,
                  name: post.community.name,
                  type: 'community',
                })
              },
              destructive: true,
              icon: {
                color: theme.colors.red.accent,
                name: 'users-four-duotone',
                type: 'icon',
              },
              id: 'hideCommunity',
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
              action() {
                report({
                  id: post.id,
                  reason: item,
                  type: 'post',
                })
              },
              id: `report.${item}`,
              title: t(`report.${item}`, {
                community: post.community.name,
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
