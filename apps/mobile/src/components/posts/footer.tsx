import { useRouter } from 'expo-router'
import { useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { withoutAgo } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { PostSaveCard } from './save'
import { PostShareCard } from './share'
import { PostVoteCard } from './vote'

export type PostLabel = 'user' | 'subreddit'

type Props = {
  expanded?: boolean
  label?: PostLabel
  post: Post
}

export function PostFooterCard({ expanded = false, label, post }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { theme } = useStyles()

  const items = [
    {
      icon: 'ArrowFatUp',
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
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
      label: withoutAgo(
        f.relativeTime(post.createdAt, {
          style: 'narrow',
        }),
      ),
    },
  ] as const

  return (
    <Pressable
      direction="row"
      disabled={expanded}
      gap="4"
      justify="between"
      onPress={() => {
        router.navigate({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      p="3"
    >
      <View align="start" flexShrink={1} gap="2">
        <Pressable
          hitSlop={theme.space[4]}
          onPress={() => {
            if (label === 'subreddit') {
              router.navigate({
                params: {
                  name: removePrefix(post.subreddit),
                },
                pathname: '/communities/[name]',
              })
            } else {
              router.navigate({
                params: {
                  name: removePrefix(post.user.name),
                },
                pathname: '/users/[name]',
              })
            }
          }}
        >
          <Text lines={1} size="2" weight="medium">
            {label === 'subreddit' ? post.subreddit : post.user.name}
          </Text>
        </Pressable>

        <View align="center" direction="row" gap="2">
          {post.sticky ? (
            <Icon
              color={theme.colors.accent.a9}
              name="PushPin"
              size={theme.typography[2].fontSize}
              weight="fill"
            />
          ) : null}

          {items.map((item) => (
            <View align="center" direction="row" gap="1" key={item.key}>
              <Icon
                color={theme.colors.gray.a12}
                name={item.icon}
                size={theme.typography[2].fontSize}
              />

              <Text size="2" tabular>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View align="center" direction="row" gap="2">
        <PostVoteCard expanded={expanded} post={post} />

        <PostSaveCard post={post} />

        {!expanded ? <PostShareCard post={post} /> : null}
      </View>
    </Pressable>
  )
}
