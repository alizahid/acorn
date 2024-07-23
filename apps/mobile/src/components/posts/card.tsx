import { useRouter } from 'expo-router'
import { View } from 'react-native'
import BookmarkSimpleIcon from 'react-native-phosphor/src/duotone/BookmarkSimple'
import ChatCircleTextIcon from 'react-native-phosphor/src/duotone/ChatCircleText'
import ClockIcon from 'react-native-phosphor/src/duotone/Clock'
import ShareFatIcon from 'react-native-phosphor/src/duotone/ShareFat'
import BookmarkSimpleFillIcon from 'react-native-phosphor/src/fill/BookmarkSimple'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useSave } from '~/hooks/mutations/posts/save'
import { type FeedType } from '~/hooks/queries/posts/feed'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { PostImages } from './images'
import { PostVideo } from './video'
import { PostVote } from './vote'

type Props = {
  feedType: FeedType
  post: Post
  viewing: boolean
}

export function PostCard({ feedType, post, viewing }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { save } = useSave()

  const footer = [
    {
      Icon: ChatCircleTextIcon,
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
      onPress: () => {
        router.push(`/posts/${post.id}`)
      },
    },
    {
      Icon: ClockIcon,
      key: 'created',
      label: f.relativeTime(post.createdAt, {
        style: 'narrow',
      }),
    },
    'separator-1',
    {
      Icon: post.saved ? BookmarkSimpleFillIcon : BookmarkSimpleIcon,
      color: post.saved ? theme.colors.accentA[9] : undefined,
      key: 'save',
      onPress: () => {
        save({
          action: post.saved ? 'unsave' : 'save',
          feedType,
          postId: post.id,
        })
      },
    },
    {
      Icon: ShareFatIcon,
      key: 'share',
      onPress: () => null,
    },
  ]

  return (
    <View>
      <View style={styles.header}>
        <Pressable>
          <Text highContrast={false} size="1" weight="medium">
            r/{post.subreddit}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push(`/posts/${post.id}`)
          }}
        >
          <Text highContrast={!post.read} weight="bold">
            {post.title}
          </Text>
        </Pressable>
      </View>

      {post.media.video ? (
        <PostVideo key={post.id} video={post.media.video} viewing={viewing} />
      ) : post.media.images ? (
        <PostImages images={post.media.images} key={post.id} />
      ) : null}

      <View style={styles.footer}>
        <PostVote feedType={feedType} post={post} />

        {footer.map((item) => {
          if (typeof item === 'string') {
            return <View key={item} style={styles.separator} />
          }

          return (
            <Pressable
              disabled={!item.onPress}
              key={item.key}
              onPress={item.onPress}
              style={styles.action}
            >
              <item.Icon
                color={item.color ?? theme.colors.grayA[post.read ? 11 : 12]}
                size={theme.typography[2].lineHeight}
              />

              {item.label !== undefined ? (
                <Text highContrast={!post.read} size="2" style={styles.label}>
                  {item.label}
                </Text>
              ) : null}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[2],
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  header: {
    gap: theme.space[1],
    padding: theme.space[2],
  },
  label: {
    fontVariant: ['tabular-nums'],
  },
  separator: {
    flex: 1,
  },
}))
