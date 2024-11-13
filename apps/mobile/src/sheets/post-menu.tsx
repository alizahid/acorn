import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
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
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

import { SheetHeader } from '../components/sheets/header'
import { SheetItem } from '../components/sheets/item'

export type PostMenuSheetProps = {
  post: Post
}

export const PostMenuSheet = createCallable<PostMenuSheetProps>(
  function Component({ post }) {
    const t = useTranslations('sheet.postMenu')

    const { styles, theme } = useStyles(stylesheet)

    const modalMenu = useRef<BottomSheetModal>(null)
    const modalReport = useRef<BottomSheetModal>(null)

    const [reason, setReason] = useState<ReportReason>()

    const { vote } = usePostVote()
    const { save } = usePostSave()

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
        key: post.liked ? 'removeUpvote' : 'upvote',
        onPress() {
          vote({
            direction: post.liked ? 0 : 1,
            postId: post.id,
          })

          modalMenu.current?.close()
        },
        weight: post.liked ? 'regular' : undefined,
      },
      {
        color: theme.colors.violet.a9,
        icon: 'ArrowFatDown',
        key: post.liked === false ? 'removeDownvote' : 'downvote',
        onPress() {
          vote({
            direction: post.liked === false ? 0 : -1,
            postId: post.id,
          })

          modalMenu.current?.close()
        },
        weight: post.liked === false ? 'regular' : undefined,
      },
      {
        color: theme.colors.green.a9,
        icon: 'BookmarkSimple',
        key: post.saved ? 'unsave' : 'save',
        onPress() {
          save({
            action: post.saved ? 'unsave' : 'save',
            postId: post.id,
          })

          modalMenu.current?.close()
        },
        weight: post.saved ? 'regular' : undefined,
      },
      {
        color: theme.colors.blue.a9,
        icon: 'ArrowBendUpLeft',
        key: 'reply',
        onPress() {
          modalReport.current?.present()
        },
      },

      'one',
      {
        icon: 'Export',
        key: 'share',
        onPress() {
          const url = new URL(post.permalink, 'https://reddit.com')

          void Sharing.shareAsync(url.toString())

          modalMenu.current?.close()
        },
      },
      {
        icon: 'Copy',
        key: 'copyLink',
        onPress() {
          const url = new URL(post.permalink, 'https://reddit.com')

          void copy(url.toString())

          modalMenu.current?.close()
        },
      },

      'two',
      {
        icon: post.hidden ? 'Eye' : 'EyeClosed',
        key: post.hidden ? 'unhide' : 'hide',
        onPress() {
          hide({
            action: post.hidden ? 'unhide' : 'hide',
            id: post.id,
            type: 'post',
          })

          modalMenu.current?.close()
        },
      },
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
          hide({
            action: 'hide',
            id: post.user.id,
            type: 'user',
          })

          modalMenu.current?.close()
        },
      },
      {
        icon: 'UsersFour',
        key: 'hideCommunity',
        onPress() {
          hide({
            action: 'hide',
            id: post.community.id,
            type: 'community',
          })

          modalMenu.current?.close()
        },
      },
    ] as const

    const reasons = [
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
            ListHeaderComponent={<SheetHeader title={t('menu.title.post')} />}
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
                    community: post.community.name,
                    user: post.user.name,
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
                          id: post.id,
                          reason,
                          type: 'post',
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
                label={t(`report.${item}`, {
                  community: post.community.name,
                  user: post.user.name,
                })}
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
