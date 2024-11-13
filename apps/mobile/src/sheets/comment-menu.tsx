import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import * as Sharing from 'expo-sharing'
import { useEffect, useRef, useState } from 'react'
import { createCallable } from 'react-call'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { SheetBackDrop } from '~/components/sheets/back-drop'
import { useCopy } from '~/hooks/copy'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { type CommentReply } from '~/types/comment'

import { SheetHeader } from '../components/sheets/header'
import { SheetItem } from '../components/sheets/item'

export type CommentMenuSheetProps = {
  comment: CommentReply
}

export const CommentMenuSheet = createCallable<CommentMenuSheetProps>(
  function Component({ comment }) {
    const router = useRouter()

    const t = useTranslations('sheet.postMenu')

    const { styles, theme } = useStyles(stylesheet)

    const modalMenu = useRef<BottomSheetModal>(null)
    const modalReport = useRef<BottomSheetModal>(null)

    const [reason, setReason] = useState<ReportReason>()

    const { vote } = useCommentVote()
    const { save } = useCommentSave()

    const { copy } = useCopy()
    const { hide } = useHide()

    const { isPending, report } = useReport()

    useEffect(() => {
      modalMenu.current?.present()
    }, [])

    const items = [
      {
        color: theme.colors.orange.a9,
        icon: 'ArrowFatUp',
        key: comment.liked ? 'removeUpvote' : 'upvote',
        onPress() {
          vote({
            commentId: comment.id,
            direction: comment.liked ? 0 : 1,
            postId: comment.postId,
          })

          modalMenu.current?.close()
        },
        weight: comment.liked ? 'regular' : undefined,
      },
      {
        color: theme.colors.violet.a9,
        icon: 'ArrowFatDown',
        key: comment.liked === false ? 'removeDownvote' : 'downvote',
        onPress() {
          vote({
            commentId: comment.id,
            direction: comment.liked === false ? 0 : -1,
            postId: comment.postId,
          })

          modalMenu.current?.close()
        },
        weight: comment.liked === false ? 'regular' : undefined,
      },
      {
        color: theme.colors.green.a9,
        icon: 'BookmarkSimple',
        key: comment.saved ? 'unsave' : 'save',
        onPress() {
          save({
            action: comment.saved ? 'unsave' : 'save',
            commentId: comment.id,
            postId: comment.postId,
          })

          modalMenu.current?.close()
        },
        weight: comment.saved ? 'regular' : undefined,
      },
      {
        color: theme.colors.blue.a9,
        icon: 'ArrowBendUpLeft',
        key: 'reply',
        onPress() {
          router.navigate({
            params: {
              commentId: comment.id,
              id: comment.postId,
              user: comment.user.name,
            },
            pathname: '/posts/[id]/reply',
          })

          modalMenu.current?.close()
        },
      },

      'one',
      {
        icon: 'Export',
        key: 'share',
        onPress() {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void Sharing.shareAsync(url.toString())

          modalMenu.current?.close()
        },
      },
      {
        icon: 'Copy',
        key: 'copyLink',
        onPress() {
          const url = new URL(comment.permalink, 'https://reddit.com')

          void copy(url.toString())

          modalMenu.current?.close()
        },
      },

      'two',
      {
        icon: 'Flag',
        key: 'report',
        onPress() {
          modalReport.current?.present()
        },
      },

      'three',
      {
        icon: 'User',
        key: 'hideUser',
        onPress() {
          if (comment.user.id) {
            hide({
              action: 'hide',
              id: comment.user.id,
              type: 'user',
            })
          }

          modalMenu.current?.close()
        },
      },
    ] as const

    const reasons = [
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
    ] as const

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          backdropComponent={SheetBackDrop}
          backgroundStyle={styles.background}
          enablePanDownToClose
          handleComponent={null}
          maxDynamicContentSize={styles.maxHeight.height}
          ref={modalMenu}
          stackBehavior="push"
          style={styles.main}
        >
          <BottomSheetFlatList
            ListHeaderComponent={
              <SheetHeader title={t('menu.title.comment')} />
            }
            contentContainerStyle={styles.content}
            data={items}
            renderItem={({ item }) => {
              if (typeof item === 'string') {
                return <View height="4" key={item} />
              }

              return (
                <SheetItem
                  icon={{
                    color: 'color' in item ? item.color : undefined,
                    name: item.icon,
                    weight: 'weight' in item ? item.weight : undefined,
                  }}
                  key={item.key}
                  label={t(`menu.${item.key}`, {
                    user: comment.user.name,
                  })}
                  onPress={item.onPress}
                />
              )
            }}
            stickyHeaderIndices={[0]}
            style={styles.content}
          />
        </BottomSheetModal>

        <BottomSheetModal
          backdropComponent={SheetBackDrop}
          backgroundStyle={styles.background}
          enablePanDownToClose
          handleComponent={null}
          maxDynamicContentSize={styles.maxHeight.height}
          ref={modalReport}
          stackBehavior="push"
          style={styles.main}
        >
          <BottomSheetFlatList
            ListHeaderComponent={
              <SheetHeader
                right={
                  reason ? (
                    <HeaderButton
                      icon="PaperPlaneTilt"
                      loading={isPending}
                      onPress={() => {
                        report({
                          id: comment.id,
                          postId: comment.postId,
                          reason,
                          type: 'comment',
                        })

                        modalReport.current?.close()
                      }}
                      weight="fill"
                    />
                  ) : null
                }
                title={t('report.title')}
              />
            }
            contentContainerStyle={styles.content}
            data={reasons}
            renderItem={({ item }) => (
              <SheetItem
                key={item}
                label={t(`report.${item}`)}
                onPress={() => {
                  setReason(item)
                }}
                selected={item === reason}
              />
            )}
            stickyHeaderIndices={[0]}
            style={styles.content}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    )
  },
  250,
)

const stylesheet = createStyleSheet((theme, runtime) => ({
  background: {
    backgroundColor: theme.colors.gray[1],
    borderRadius: 0,
  },
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  main: {
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[5],
    borderTopRightRadius: theme.radius[5],
    overflow: 'hidden',
  },
  maxHeight: {
    height: runtime.screen.height * 0.8,
  },
}))
