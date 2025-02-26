import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { createCallable } from 'react-call'
import { Alert, Share } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Logo } from '~/components/common/logo'
import { View } from '~/components/common/view'
import { SheetItem } from '~/components/sheets/item'
import { SheetModal } from '~/components/sheets/modal'
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

type Props = {
  comment: CommentReply
}

export const CommentMenu = createCallable<Props>(({ call, comment }) => {
  const router = useRouter()

  const { accountId } = useAuth()
  const { oldReddit } = usePreferences()

  const t = useTranslations('component.posts.menu')

  const { theme } = useStyles()

  const sheet = useRef<BottomSheetModal>(null)
  const sheetReport = useRef<BottomSheetModal>(null)

  const { vote } = useCommentVote()
  const { save } = useCommentSave()
  const { remove } = useCommentRemove()
  const { report } = useReport()

  const { copy } = useCopy()
  const { hide } = useHide()
  const { handleLink, open } = useLink()

  useEffect(() => {
    sheet.current?.present()
  }, [])

  useEffect(() => {
    if (call.ended) {
      sheet.current?.close()
    }
  }, [call.ended])

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
      <SheetModal
        container="scroll"
        onClose={() => {
          call.end()
        }}
        ref={sheet}
        title={t('title.comment')}
      >
        <SheetItem
          icon={{
            color: theme.colors.orange.accent,
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

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.violet.accent,
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

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.green.accent,
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

            call.end()
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
                commentId: comment.id,
                id: comment.post.id,
                user: comment.user.name,
              },
              pathname: '/posts/[id]/reply',
            })

            call.end()
          }}
        />

        {comment.user.name === accountId ? (
          <>
            <View height="4" />

            <SheetItem
              icon={{
                name: 'PencilSimple',
                type: 'icon',
              }}
              label={t('editComment')}
              onPress={() => {
                router.navigate({
                  params: {
                    body: comment.body,
                    commentId: comment.id,
                    id: comment.post.id,
                    postId: comment.post.id,
                  },
                  pathname: '/posts/[id]/reply',
                })

                call.end()
              }}
            />

            <SheetItem
              icon={{
                color: theme.colors.red.accent,
                name: 'Trash',
                type: 'icon',
              }}
              label={t('deleteComment.title')}
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

                        call.end()
                      },
                      style: 'destructive',
                      text: t('deleteComment.yes'),
                    },
                  ],
                )
              }}
            />
          </>
        ) : null}

        <View height="4" />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'Copy',
            type: 'icon',
          }}
          label={t('copyText')}
          onPress={() => {
            void Clipboard.setStringAsync(comment.body)

            call.end()
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
              comment.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            void copy(url.toString())

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
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

            call.end()
          }}
        />

        <View height="4" />

        <SheetItem
          label={t('openApp')}
          left={<Logo size={theme.space[5]} />}
          onPress={() => {
            void handleLink(comment.permalink)

            call.end()
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
              comment.permalink,
              oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
            )

            void open(url.toString())

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.gray.textLow,
            name: 'User',
            type: 'icon',
          }}
          label={t('openUser', {
            user: comment.user.name,
          })}
          onPress={() => {
            router.navigate({
              params: {
                name: comment.user.name,
              },
              pathname: '/users/[name]',
            })

            call.end()
          }}
        />

        <View height="4" />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
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

            call.end()
          }}
        />

        <SheetItem
          icon={{
            color: theme.colors.red.accent,
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

            call.end()
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
            sheetReport.current?.present()
          }}
        />
      </SheetModal>

      <SheetModal
        container="scroll"
        ref={sheetReport}
        title={t('report.title')}
      >
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

              sheetReport.current?.close()

              call.end()
            }}
          />
        ))}
      </SheetModal>
    </>
  )
})
