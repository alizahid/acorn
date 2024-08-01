import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { type Post } from '~/types/post'

import { Icon, type IconName } from '../common/icon'
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
      icon: 'ThumbsUp' satisfies IconName,
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
    },
    {
      icon: 'ChatCircleText' satisfies IconName,
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
      {post.media.video ? (
        <PostVideoCard
          key={post.id}
          margin={margin + theme.space[5]}
          video={post.media.video}
          viewing={viewing}
        />
      ) : post.type === 'link' && post.url ? (
        <PostLinkCard
          margin={margin + theme.space[5]}
          post={post}
          style={styles.header}
        />
      ) : post.media.images ? (
        <PostGalleryCard
          images={post.media.images}
          key={post.id}
          margin={margin + theme.space[5]}
        />
      ) : null}

      <View style={styles.content}>
        <Text weight="medium">{post.title}</Text>

        <View style={styles.footer}>
          <Icon
            color={theme.colors.accent.a11}
            name="ArrowsSplit"
            size={theme.typography[2].lineHeight}
            style={styles.crossPost}
          />

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
