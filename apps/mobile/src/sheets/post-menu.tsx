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
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

import { SheetHeader } from './header'
import { SheetItem } from './item'

export type PostMenuSheetPayload = {
  post: Post
}

export type PostMenuSheetRoutes = {
  menu: RouteDefinition
  report: RouteDefinition
}

export type PostMenuSheetDefinition = SheetDefinition<{
  payload: PostMenuSheetPayload
  routes: PostMenuSheetRoutes
}>

export function PostMenuSheet({ sheetId }: SheetProps<'post-menu'>) {
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

function Menu(props: RouteScreenProps<'post-menu', 'menu'>) {
  const router = useRouter()

  const t = useTranslations('sheet.postMenu.menu')

  const { theme } = useStyles()

  const { post } = useSheetPayload<'post-menu'>()

  const { vote } = usePostVote()
  const { save } = usePostSave()

  const { copy } = useCopy()
  const { hide } = useHide()

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

        props.router.close()
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

        props.router.close()
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

        props.router.close()
      },
      weight: post.saved ? 'regular' : undefined,
    },
    {
      color: theme.colors.blue.a9,
      icon: 'ArrowBendUpLeft',
      key: 'reply',
      onPress() {
        router.navigate({
          params: {
            id: post.id,
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
        const url = new URL(post.permalink, 'https://reddit.com')

        void Share.share({
          message: post.title,
          url: url.toString(),
        })

        props.router.close()
      },
    },
    {
      icon: 'Copy',
      key: 'copyLink',
      onPress() {
        const url = new URL(post.permalink, 'https://reddit.com')

        void copy(url.toString())

        props.router.close()
      },
    },

    null,
    {
      icon: post.hidden ? 'Eye' : 'EyeClosed',
      key: post.hidden ? 'unhide' : 'hide',
      onPress() {
        hide({
          action: post.hidden ? 'unhide' : 'hide',
          id: post.id,
          type: 'post',
        })

        props.router.close()
      },
    },
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
        hide({
          action: 'hide',
          id: post.user.id,
          type: 'user',
        })

        props.router.close()
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

        props.router.close()
      },
    },
  ] as const

  return (
    <>
      <SheetHeader title={t('title.post')} />

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
              community: post.community.name,
              user: post.user.name,
            })}
            onPress={item.onPress}
          />
        )
      })}
    </>
  )
}

function Report({ router }: RouteScreenProps<'post-menu', 'menu'>) {
  const t = useTranslations('sheet.postMenu.report')

  const { post } = useSheetPayload<'post-menu'>()

  const { styles, theme } = useStyles(stylesheet)

  const [reason, setReason] = useState<ReportReason>()

  const { isPending, report } = useReport()

  return (
    <>
      <SheetHeader title={t('title')} />

      <View direction="row" gap="3" p="3" wrap="wrap">
        {(
          [
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
              {t(item, {
                community: post.community.name,
              })}
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
              id: post.id,
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
