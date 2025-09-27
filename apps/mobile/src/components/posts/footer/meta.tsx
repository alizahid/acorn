import { type SFSymbol } from 'expo-symbols'
import { useFormatter } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Text } from '~/components/common/text'
import { TimeAgo } from '~/components/common/time'
import { View } from '~/components/common/view'
import { getIcon } from '~/lib/icons'
import { type Post } from '~/types/post'

type Props = {
  post: Post
}

export function PostMeta({ post }: Props) {
  const f = useFormatter()

  const items = [
    {
      color: post.liked
        ? 'orange'
        : post.liked === false
          ? 'violet'
          : undefined,
      icon: getIcon(
        post.liked
          ? 'upvote.fill'
          : post.liked === false
            ? 'downvote.fill'
            : 'upvote',
      ) satisfies SFSymbol,
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
      weight: post.liked !== null ? 'fill' : undefined,
    },
    {
      icon: 'face.smiling.inverse' satisfies SFSymbol,
      key: 'ratio',
      label: f.number(post.ratio, {
        style: 'percent',
      }),
    },
    {
      icon: 'bubble.left' satisfies SFSymbol,
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
    },
    {
      icon: 'clock' satisfies SFSymbol,
      key: 'created',
      label: <TimeAgo>{post.createdAt}</TimeAgo>,
    },
  ] as const

  return (
    <View align="center" direction="row" gap="2">
      {post.sticky ? (
        <Icon
          name="pin"
          uniProps={(theme) => ({
            size: theme.typography[1].fontSize,
            tintColor: theme.colors.green.accent,
          })}
        />
      ) : null}

      {items.map((item) => (
        <View align="center" direction="row" gap="1" key={item.key}>
          <Icon
            name={item.icon}
            uniProps={(theme) => ({
              size: theme.typography[1].fontSize,
              tintColor:
                'color' in item && item.color
                  ? theme.colors[item.color].accent
                  : theme.colors.gray.text,
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
