import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
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
  seen?: boolean
}

export function PostFooterCard({ expanded, label, post, seen }: Props) {
  const router = useRouter()

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
      <View align="start" flexShrink={1} gap="3">
        <PostCommunity label={label} post={post} seen={seen} />

        <PostMeta post={post} seen={seen} />
      </View>

      <View align="center" direction="row" gap="3">
        <PostVoteCard expanded={expanded} post={post} seen={seen} />

        <PostSaveCard post={post} seen={seen} />

        {!expanded ? <PostShareCard post={post} seen={seen} /> : null}
      </View>
    </Pressable>
  )
}

export function PostMeta({ post, seen }: Props) {
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

          <Text highContrast={!seen} size="2" tabular>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

export function PostCommunity({ label, post, seen }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      gap="2"
      hitSlop={theme.space[3]}
      onPress={() => {
        if (label === 'subreddit') {
          if (post.community.name.startsWith('u/')) {
            router.navigate({
              params: {
                name: removePrefix(post.community.name),
              },
              pathname: '/users/[name]',
            })
          } else {
            router.navigate({
              params: {
                name: removePrefix(post.community.name),
              },
              pathname: '/communities/[name]',
            })
          }
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
      {label === 'subreddit' && post.community.image ? (
        <Image source={post.community.image} style={styles.image} />
      ) : null}

      <Text highContrast={!seen} lines={1} size="2" weight="medium">
        {label === 'subreddit' ? post.community.name : post.user.name}
      </Text>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.typography[2].lineHeight,
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
  },
}))
