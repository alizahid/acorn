import { useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { withoutAgo } from '~/lib/intl'
import { type Post } from '~/types/post'

export type PostLabel = 'user' | 'subreddit'

type Props = {
  post: Post
  seen?: boolean
}

export function PostMeta({ post, seen }: Props) {
  const f = useFormatter()

  const { theme } = useStyles()

  const items = [
    {
      color: post.liked
        ? theme.colors.orange.a9
        : post.liked === false
          ? theme.colors.violet.a9
          : undefined,
      icon: post.liked === false ? 'ArrowFatDown' : 'ArrowFatUp',
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
      weight: post.liked !== null ? 'fill' : undefined,
    },
    {
      icon: 'ChatCircle',
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
    },
    {
      icon: 'Clock',
      key: 'created',
      label: withoutAgo(
        f.relativeTime(post.createdAt, {
          style: 'narrow',
        }),
      ),
    },
  ] as const

  return (
    <View align="center" direction="row" gap="3" pointerEvents="none">
      {post.sticky ? (
        <Icon
          color={theme.colors.red.a9}
          name="PushPin"
          size={theme.typography[2].fontSize}
          weight="fill"
        />
      ) : null}

      {items.map((item) => (
        <View align="center" direction="row" gap="1" key={item.key}>
          <Icon
            color={
              'color' in item && item.color
                ? item.color
                : theme.colors.gray[seen ? 'a11' : 'a12']
            }
            name={item.icon}
            size={theme.typography[2].fontSize}
            weight={'weight' in item ? item.weight : undefined}
          />

          <Text highContrast={!seen} size="2" tabular>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
