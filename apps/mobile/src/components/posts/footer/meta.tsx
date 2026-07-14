import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { Icon, type IconName } from '~/components/common/icon'
import { Text } from '~/components/common/text'
import { TimeAgo } from '~/components/common/time'
import { type Post } from '~/types/post'

type Props = {
  post: Post
  privacy?: boolean
}

export function PostMeta({ post, privacy }: Props) {
  const f = useFormatter()

  const items = [
    {
      color: privacy
        ? undefined
        : post.liked
          ? 'orange'
          : post.liked === false
            ? 'violet'
            : undefined,
      icon: (privacy
        ? 'arrow-fat-up'
        : post.liked
          ? 'arrow-fat-up-fill'
          : post.liked === false
            ? 'arrow-fat-down-fill'
            : 'arrow-fat-up') satisfies IconName,
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
      weight: post.liked === null ? undefined : 'fill',
    },
    {
      icon: 'smiley' satisfies IconName,
      key: 'ratio',
      label: f.number(post.ratio, {
        style: 'percent',
      }),
    },
    {
      icon: 'chat-centered' satisfies IconName,
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
    },
    {
      icon: 'clock' satisfies IconName,
      key: 'created',
      label: <TimeAgo date={post.createdAt} />,
    },
  ] as const

  return (
    <View style={styles.main}>
      {post.sticky ? (
        <Icon
          name="push-pin-fill"
          uniProps={(theme) => ({
            color: theme.colors.green.accent,
            size: theme.typography[1].fontSize,
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
              size: theme.typography[1].fontSize,
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
