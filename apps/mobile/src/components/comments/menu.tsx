import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import { forwardRef, useRef } from 'react'
import { Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'
import { useLink } from '~/hooks/link'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { usePreferences } from '~/stores/preferences'
import { type CommentReply } from '~/types/comment'

import { Logo } from '../common/logo'
import { View } from '../common/view'
import { SheetItem } from '../sheets/item'
import { SheetModal } from '../sheets/modal'

type Props = {
  comment: CommentReply
  onClose: () => void
}

export const CommentMenu = forwardRef<BottomSheetModal, Props>(
  function Component({ comment, onClose }, ref) {
    const router = useRouter()

    const { oldReddit } = usePreferences()

    const t = useTranslations('component.posts.menu')

    const { theme } = useStyles()

    const sheet = useRef<BottomSheetModal>(null)

    const { vote } = useCommentVote()
    const { save } = useCommentSave()
    const { report } = useReport()

    const { copy } = useCopy()
    const { hide } = useHide()
    const { handleLink, open } = useLink()

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
      <>
        <SheetModal container="scroll" ref={ref} title={t('title.comment')}>
          <SheetItem
            icon={{
              color: theme.colors.orange.a9,
              name: 'ArrowFatUp',
              type: 'icon',
            }}
            label={t(comment.liked ? 'removeUpvote' : 'upvote')}
            onPress={() => {
              vote({
                commentId: comment.id,
                direction: comment.liked ? 0 : 1,
                postId: comment.post.id,
              })

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.violet.a9,
              name: 'ArrowFatDown',
              type: 'icon',
            }}
            label={t(comment.liked === false ? 'removeDownvote' : 'downvote')}
            onPress={() => {
              vote({
                commentId: comment.id,
                direction: comment.liked === false ? 0 : -1,
                postId: comment.post.id,
              })

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.green.a9,
              name: 'BookmarkSimple',
              type: 'icon',
            }}
            label={t(comment.saved ? 'unsave' : 'save')}
            onPress={() => {
              save({
                action: comment.saved ? 'unsave' : 'save',
                commentId: comment.id,
                postId: comment.post.id,
              })

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.blue.a9,
              name: 'ArrowBendUpLeft',
              type: 'icon',
            }}
            label={t('reply')}
            onPress={() => {
              router.navigate({
                params: {
                  commentId: comment.id,
                  id: comment.post.id,
                  user: comment.user.name,
                },
                pathname: '/posts/[id]/reply',
              })

              onClose()
            }}
          />

          <View height="4" />

          <SheetItem
            icon={{
              color: theme.colors.gray.a11,
              name: 'Copy',
              type: 'icon',
            }}
            label={t('copyText')}
            onPress={() => {
              void Clipboard.setStringAsync(comment.body)

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.gray.a11,
              name: 'Copy',
              type: 'icon',
            }}
            label={t('copyLink')}
            onPress={() => {
              const url = new URL(
                comment.permalink,
                oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
              )

              void copy(url.toString())

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.gray.a11,
              name: 'Share',
              type: 'icon',
            }}
            label={t('share')}
            onPress={() => {
              const url = new URL(
                comment.permalink,
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
              void handleLink(comment.permalink)

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.gray.a11,
              name: 'Compass',
              type: 'icon',
            }}
            label={t('openBrowser')}
            onPress={() => {
              const url = new URL(
                comment.permalink,
                oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
              )

              void open(url.toString())

              onClose()
            }}
          />

          <View height="4" />

          <SheetItem
            icon={{
              color: theme.colors.red.a9,
              name: 'EyeClosed',
              type: 'icon',
            }}
            label={t('hideComment')}
            onPress={() => {
              hide({
                action: 'hide',
                id: comment.id,
                postId: comment.post.id,
                type: 'comment',
              })

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.red.a9,
              name: 'User',
              type: 'icon',
            }}
            label={t('hideUser', {
              user: comment.user.name,
            })}
            onPress={() => {
              if (comment.user.id) {
                hide({
                  action: 'hide',
                  id: comment.user.id,
                  type: 'user',
                })
              }

              onClose()
            }}
          />

          <SheetItem
            icon={{
              color: theme.colors.red.a9,
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
              label={t(`report.${item}`)}
              onPress={() => {
                report({
                  id: comment.id,
                  postId: comment.post.id,
                  reason: item,
                  type: 'comment',
                })

                sheet.current?.close()

                onClose()
              }}
            />
          ))}
        </SheetModal>
      </>
    )
  },
)
