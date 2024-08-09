import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  margin?: number
  post: Post
  viewing: boolean
}

export function CrossPostCard({ margin = 0, post, viewing }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const footer = [
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
  ] as const

  return (
    <Pressable
      onPress={() => {
        router.navigate(`/posts/${post.id}`)
      }}
      style={styles.main}
    >
      {post.type === 'video' && post.media.video ? (
        <PostVideoCard
          margin={margin}
          video={post.media.video}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'image' && post.media.images ? (
        <PostGalleryCard
          images={post.media.images}
          margin={margin}
          recyclingKey={post.id}
        />
      ) : null}

      {post.type === 'link' ? (
        <PostLinkCard margin={margin} post={post} />
      ) : null}

      <View style={styles.content}>
        <Text weight="medium">{post.title}</Text>

        <View style={styles.footer}>
          <Pressable
            hitSlop={theme.space[4]}
            onPress={() => {
              router.push(`/communities/${post.subreddit}`)
            }}
            style={styles.item}
          >
            <Icon
              color={theme.colors.accent.a11}
              name="ArrowsSplit"
              size={theme.typography[2].lineHeight}
              style={styles.crossPost}
            />

            <Text size="2" weight="medium">
              {post.subreddit}
            </Text>
          </Pressable>

          {footer.map((item) => (
            <View key={item.key} style={styles.item}>
              <Icon
                color={theme.colors.gray.a11}
                name={item.icon}
                size={theme.typography[2].lineHeight}
              />

              <Text highContrast={false} size="2" tabular>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    gap: theme.space[3],
    padding: theme.space[3],
  },
  crossPost: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
  },
  header: {
    marginTop: theme.space[3],
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[4],
    marginHorizontal: theme.space[3],
    overflow: 'hidden',
  },
}))
