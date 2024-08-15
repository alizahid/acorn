import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { withoutAgo } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
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

  const { styles, theme } = useStyles(stylesheet)

  const items = [
    {
      icon: 'ThumbsUp',
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
    },
    {
      icon: 'ChatCircleText',
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
      disabled={expanded}
      onPress={() => {
        router.navigate({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      style={styles.main}
    >
      <View style={styles.meta}>
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
                  type: 'submitted',
                },
                pathname: '/users/[name]/[type]',
              })
            }
          }}
        >
          <Text highContrast={false} lines={1} size="2" weight="medium">
            {label === 'subreddit' ? post.subreddit : post.user.name}
          </Text>
        </Pressable>

        <View style={styles.items}>
          {items.map((item) => (
            <View key={item.key} style={styles.item}>
              <Icon
                color={theme.colors.gray[post.read ? 'a11' : 'a12']}
                name={item.icon}
                size={theme.typography[2].fontSize}
              />

              <Text highContrast={!post.read} size="2" tabular>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <PostVoteCard post={post} />

        <PostShareCard post={post} />

        <PostSaveCard post={post} />
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
  },
  items: {
    flexDirection: 'row',
    gap: theme.space[2],
  },
  main: {
    flexDirection: 'row',
    gap: theme.space[4],
    padding: theme.space[3],
  },
  meta: {
    alignItems: 'flex-start',
    flex: 1,
    gap: theme.space[2],
  },
}))
