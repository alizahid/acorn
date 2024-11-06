import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Share } from 'react-native'
import ActionSheet, {
  type RouteDefinition,
  type RouteScreenProps,
  type SheetDefinition,
  type SheetProps,
  useSheetPayload,
} from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useCopy } from '~/hooks/copy'
import { useHide } from '~/hooks/moderation/hide'
import { type ReportReason, useReport } from '~/hooks/moderation/report'
import { useCommentSave } from '~/hooks/mutations/comments/save'
import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { type CommentReply } from '~/types/comment'

import { SheetHeader } from './header'
import { SheetItem } from './item'

export type CommentMenuSheetPayload = {
  comment: CommentReply
}

export type CommentMenuSheetRoutes = {
  menu: RouteDefinition
  report: RouteDefinition
}

export type CommentMenuSheetDefinition = SheetDefinition<{
  payload: CommentMenuSheetPayload
  routes: CommentMenuSheetRoutes
}>

export function CommentMenuSheet({ sheetId }: SheetProps<'comment-menu'>) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <ActionSheet
      containerStyle={styles.main}
      enableRouterBackNavigation
      gestureEnabled
      id={sheetId}
      indicatorStyle={styles.indicator}
      initialRoute="menu"
      overlayColor={theme.colors.gray.a9}
      routes={[
        {
          component: Menu,
          name: 'menu',
        },
        {
          component: Report,
          name: 'report',
        },
      ]}
    />
  )
}

function Menu(props: RouteScreenProps<'comment-menu', 'menu'>) {
  const router = useRouter()

  const t = useTranslations('sheet.postMenu.menu')

  const { theme } = useStyles()

  const { comment } = useSheetPayload<'comment-menu'>()

  const { vote } = useCommentVote()
  const { save } = useCommentSave()

  const { copy } = useCopy()
  const { hide } = useHide()

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

        props.router.close()
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

        props.router.close()
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

        props.router.close()
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

        props.router.close()
      },
    },

    null,
    {
      icon: 'Share',
      key: 'share',
      onPress() {
        const url = new URL(comment.permalink, 'https://reddit.com')

        void Share.share({
          url: url.toString(),
        })

        props.router.close()
      },
    },
    {
      icon: 'Copy',
      key: 'copyLink',
      onPress() {
        const url = new URL(comment.permalink, 'https://reddit.com')

        void copy(url.toString())

        props.router.close()
      },
    },

    null,
    {
      icon: 'Flag',
      key: 'report',
      onPress() {
        props.router.navigate('report')
      },
    },

    null,
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

        props.router.close()
      },
    },
  ] as const

  return (
    <>
      <SheetHeader title={t('title.comment')} />

      {items.map((item, index) => {
        if (item === null) {
          // eslint-disable-next-line react/no-array-index-key -- go away
          return <View height="4" key={index} />
        }

        return (
          <SheetItem
            icon={{
              color: 'color' in item ? item.color : undefined,
              name: item.icon,
              weight: 'weight' in item ? item.weight : undefined,
            }}
            key={item.key}
            label={t(item.key, {
              user: comment.user.name,
            })}
            onPress={item.onPress}
          />
        )
      })}
    </>
  )
}

function Report({ router }: RouteScreenProps<'comment-menu', 'menu'>) {
  const t = useTranslations('sheet.postMenu.report')

  const { comment } = useSheetPayload<'comment-menu'>()

  const { styles, theme } = useStyles(stylesheet)

  const [reason, setReason] = useState<ReportReason>()

  const { isPending, report } = useReport()

  return (
    <>
      <SheetHeader title={t('title')} />

      <View direction="row" gap="3" p="3" wrap="wrap">
        {(
          [
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
        ).map((item) => (
          <Pressable
            align="center"
            direction="row"
            gap="2"
            hitSlop={theme.space[3]}
            key={item}
            onPress={() => {
              if (reason === item) {
                setReason(undefined)
              } else {
                setReason(item)
              }
            }}
            px="2"
            py="1"
            style={[styles.reason(item === reason)]}
          >
            <Text contrast={item === reason} size="2">
              {t(item)}
            </Text>
          </Pressable>
        ))}
      </View>

      {reason ? (
        <Button
          label={t('title')}
          loading={isPending}
          onPress={() => {
            report({
              id: comment.id,
              reason,
              type: 'post',
            })

            router.close()
          }}
          style={styles.submit}
        />
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  indicator: {
    display: 'none',
  },
  main: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[3] + runtime.insets.bottom,
  },
  reason: (selected: boolean) => ({
    backgroundColor: selected ? theme.colors.accent.a9 : theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  }),
  submit: {
    marginHorizontal: theme.space[3],
  },
}))
