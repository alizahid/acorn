import { type Post } from '@acorn/reddit'
import { compact } from 'lodash'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { Icon, type IconName } from '~/components/common/icon'
import { Text } from '~/components/common/text'
import { TimeAgo } from '~/components/common/time'
import { type ColorToken } from '~/styles/tokens'

type Props = {
  post: Post
  privacy?: boolean
}

export function PostMeta({ post, privacy }: Props) {
  const f = useFormatter()

  const items = compact([
    !post.scoreHidden && {
      color: privacy
        ? undefined
        : post.liked
          ? ('orange' as const satisfies ColorToken)
          : post.liked === false
            ? ('violet' as const satisfies ColorToken)
            : undefined,
      icon: privacy
        ? ('arrow-fat-up' as const satisfies IconName)
        : post.liked
          ? ('arrow-fat-up-fill' as const satisfies IconName)
          : post.liked === false
            ? ('arrow-fat-down-fill' as const satisfies IconName)
            : ('arrow-fat-up' as const satisfies IconName),
      key: 'votes' as const,
      label: f.number(post.votes, {
        notation: 'compact',
      }),
      weight: post.liked === null ? undefined : 'fill',
    },
    {
      icon: 'smiley' as const satisfies IconName,
      key: 'ratio' as const,
      label: f.number(post.ratio, {
        style: 'percent',
      }),
    },
    {
      icon: 'chat-centered' as const satisfies IconName,
      key: 'comments' as const,
      label: f.number(post.comments, {
        notation: 'compact',
      }),
    },
    {
      icon: 'clock' as const satisfies IconName,
      key: 'created' as const,
      label: <TimeAgo date={post.createdAt} />,
    },
  ])

  return (
    <View style={styles.main}>
      {post.sticky ? (
        <Icon
          name="push-pin-fill"
          uniProps={(theme) => ({
            color: theme.colors.green.accent,
            size: theme.typography[1].lineHeight,
          })}
        />
      ) : null}

      {post.edited ? (
        <Icon
          name="pencil"
          uniProps={(theme) => ({
            color: theme.colors.accent.accent,
            size: theme.typography[1].lineHeight,
          })}
        />
      ) : null}

      {post.locked || post.archived ? (
        <Icon
          name="lock-simple"
          uniProps={(theme) => ({
            color: theme.colors.red.accent,
            size: theme.typography[1].lineHeight,
          })}
        />
      ) : null}

      {items.map((item) => (
        <View key={item.key} style={styles.item}>
          <Icon
            name={item.icon}
            uniProps={(theme) => ({
              color:
                'color' in item && item.color
                  ? theme.colors[item.color].accent
                  : theme.colors.gray.text,
              size: theme.typography[1].lineHeight,
            })}
          />

          <Text size="1" tabular>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    marginTop: 'auto',
  },
}))
