import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import { forwardRef, useRef } from 'react'
import { Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useCopyImage } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Logo } from '../common/logo'
import { View } from '../common/view'
import { SheetItem } from '../sheets/item'
import { SheetModal } from '../sheets/modal'

type Props = {
  onClose: () => void
  post: Post
}

export const PostMenu = forwardRef<BottomSheetModal, Props>(function Component(
  { onClose, post },
  ref,
) {
  const router = useRouter()

  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')

  const { theme } = useStyles()

  const sheet = useRef<BottomSheetModal>(null)

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, open } = useLink()
  const { copy: copyImage } = useCopyImage()

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
    <>
      <SheetModal container="scroll" ref={ref} title={t('title.post')}>
        <SheetItem
          icon={{
            color: theme.colors.orange.accent,
            name: 'ArrowFatUp',
            type: 'icon',
          }}
          label={t(post.liked ? 'removeUpvote' : 'upvote')}
          onPress={() => {
            vote({
              direction: post.liked ? 0 : 1,
              postId: post.id,
            })

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.violet.accent,
            name: 'ArrowFatDown',
            type: 'icon',
          }}
          label={t(post.liked === false ? 'removeDownvote' : 'downvote')}
          onPress={() => {
            vote({
              direction: post.liked === false ? 0 : -1,
              postId: post.id,
            })

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.green.accent,
            name: 'BookmarkSimple',
            type: 'icon',
          }}
          label={t(post.saved ? 'unsave' : 'save')}
          onPress={() => {
            save({
              action: post.saved ? 'unsave' : 'save',
              postId: post.id,
            })

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.blue.accent,
            name: 'ArrowBendUpLeft',
            type: 'icon',
          }}
          label={t('reply')}
          onPress={() => {
            router.navigate({
              params: {
                id: post.id,
              },
              pathname: '/posts/[id]/reply',
            })

            onClose()
          }}
        />

        <View height="4" />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Copy',
            type: 'icon',
          }}
          label={t('copyText')}
          onPress={() => {
            if (post.body) {
              void Clipboard.setStringAsync(post.body)
            }

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Copy',
            type: 'icon',
          }}
          label={t('copyLink')}
          onPress={() => {
            const url = new URL(
              post.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            void copy(url.toString())

            onClose()
          }}
        />

        {post.type === 'image' && post.media.images?.[0] ? (
          <SheetItem
            icon={{
              color: theme.colors.gray.textLow,
              name: 'Copy',
              type: 'icon',
            }}
            label={t('copyImage')}
            onPress={() => {
              if (!post.media.images?.[0]?.url) {
                onClose()

                return
              }

              copyImage({
                url: post.media.images[0].url,
              })

              onClose()
            }}
          />
        ) : null}

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Share',
            type: 'icon',
          }}
          label={t('share')}
          onPress={() => {
            const url = new URL(
              post.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            void Share.share({
              url: url.toString(),
            })

            onClose()
          }}
        />

        <View height="4" />

        <SheetItem
          label={t('openApp')}
          left={<Logo size={theme.space[5]} />}
          onPress={() => {
            void handleLink(post.permalink)

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Compass',
            type: 'icon',
          }}
          label={t('openBrowser')}
          onPress={() => {
            const url = new URL(
              post.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            void open(url.toString())

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'User',
            type: 'icon',
          }}
          label={t('openUser', {
            user: post.user.name,
          })}
          onPress={() => {
            router.navigate({
              params: {
                name: post.user.name,
              },
              pathname: '/users/[name]',
            })

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'UsersFour',
            type: 'icon',
          }}
          label={t('openCommunity', {
            community: post.community.name,
          })}
          onPress={() => {
            router.navigate({
              params: {
                name: post.community.name,
              },
              pathname: '/communities/[name]',
            })

            onClose()
          }}
        />

        <View height="4" />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
            name: 'EyeClosed',
            type: 'icon',
          }}
          label={t('hidePost')}
          onPress={() => {
            hide({
              action: post.hidden ? 'unhide' : 'hide',
              id: post.id,
              type: 'post',
            })

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
            name: 'User',
            type: 'icon',
          }}
          label={t('hideUser', {
            user: post.user.name,
          })}
          onPress={() => {
            if (post.user.id) {
              hide({
                action: 'hide',
                id: post.user.id,
                type: 'user',
              })
            }

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
            name: 'UsersFour',
            type: 'icon',
          }}
          label={t('hideCommunity', {
            community: post.community.name,
          })}
          onPress={() => {
            hide({
              action: 'hide',
              id: post.community.id,
              type: 'community',
            })

            onClose()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
            name: 'Flag',
            type: 'icon',
          }}
          label={t('report.title')}
          navigate
          onPress={() => {
            sheet.current?.present()
          }}
        />
      </SheetModal>

      <SheetModal container="scroll" ref={sheet} title={t('report.title')}>
        {reasons.map((item) => (
          <SheetItem
            key={item}
            label={t(`report.${item}`, {
              community: post.community.name,
            })}
            onPress={() => {
              report({
                id: post.id,
                reason: item,
                type: 'post',
              })

              sheet.current?.close()

              onClose()
            }}
          />
        ))}
      </SheetModal>
    </>
  )
})
