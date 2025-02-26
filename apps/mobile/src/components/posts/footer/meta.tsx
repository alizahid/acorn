import { useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Text } from '~/components/common/text'
import { TimeAgo } from '~/components/common/time'
import { View } from '~/components/common/view'
import { type Post } from '~/types/post'

type Props = {
  post: Post
}

export function PostMeta({ post }: Props) {
  const f = useFormatter()

  const { theme } = useStyles()

  const items = [
    {
      color: post.liked
        ? theme.colors.orange.accent
        : post.liked === false
          ? theme.colors.violet.accent
          : undefined,
      icon: post.liked === false ? 'ArrowFatDown' : 'ArrowFatUp',
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
      weight: post.liked !== null ? 'fill' : undefined,
    },
    {
      icon: 'Smiley',
      key: 'ratio',
      label: f.number(post.ratio, {
        style: 'percent',
      }),
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
      label: <TimeAgo>{post.createdAt}</TimeAgo>,
    },
  ] as const

  return (
    <View align="center" direction="row" gap="2" pointerEvents="none">
      {post.sticky ? (
        <Icon
          color={theme.colors.red.accent}
          name="PushPin"
          size={theme.typography[1].fontSize}
          weight="fill"
        />
      ) : null}

      {items.map((item) => (
        <View align="center" direction="row" gap="1" key={item.key}>
          <Icon
            color={
              'color' in item && item.color
                ? item.color
                : theme.colors.gray.text
            }
            name={item.icon}
            size={theme.typography[1].fontSize}
            weight={'weight' in item ? item.weight : undefined}
          />

          <Text size="1" tabular>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
