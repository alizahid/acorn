import { useRouter } from 'expo-router'
import { View } from 'react-native'
import ArrowFatDownIcon from 'react-native-phosphor/src/duotone/ArrowFatDown'
import ArrowFatUpIcon from 'react-native-phosphor/src/duotone/ArrowFatUp'
import BookmarkSimpleIcon from 'react-native-phosphor/src/duotone/BookmarkSimple'
import ChatCircleTextIcon from 'react-native-phosphor/src/duotone/ChatCircleText'
import ShareFatIcon from 'react-native-phosphor/src/duotone/ShareFat'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { PostImages } from './images'
import { PostVideo } from './video'

type Props = {
  post: Post
}

export function PostCard({ post }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const footer = [
    {
      Icon: ArrowFatUpIcon,
      key: 'ups',
      label: post.votes,
    },
    {
      Icon: ArrowFatDownIcon,
      key: 'downs',
    },
    {
      Icon: ChatCircleTextIcon,
      href: `/posts/${post.id}`,
      key: 'comments',
      label: post.comments,
    },
    'separator-1',
    {
      Icon: BookmarkSimpleIcon,
      key: 'save',
    },
    {
      Icon: ShareFatIcon,
      key: 'share',
    },
  ]

  return (
    <View>
      <Pressable
        onPress={() => {
          router.push(`/posts/${post.id}`)
        }}
        style={styles.title}
      >
        <Text highContrast weight="medium">
          {post.title}
        </Text>
      </Pressable>

      {post.media.video ? (
        <PostVideo video={post.media.video} />
      ) : post.media.images ? (
        <PostImages images={post.media.images} />
      ) : null}

      <View style={styles.footer}>
        {footer.map((item) => {
          if (typeof item === 'string') {
            return <View key={item} style={styles.separator} />
          }

          return (
            <Pressable
              key={item.key}
              onPress={() => {
                if (item.href) {
                  router.push(item.href)
                }
              }}
              style={styles.action}
            >
              <item.Icon
                color={theme.colors.grayA[11]}
                size={theme.typography[2].lineHeight}
              />

              {item.label ? (
                <Text size="2" style={styles.number}>
                  {f.number(item.label, {
                    notation: 'compact',
                  })}
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
    gap: theme.space[4],
  },
  number: {
    fontVariant: ['tabular-nums'],
  },
  separator: {
    flex: 1,
  },
  title: {
    margin: theme.space[2],
  },
}))
