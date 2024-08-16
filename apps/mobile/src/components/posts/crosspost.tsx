import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function CrossPostCard({ margin = 0, post, style, viewing }: Props) {
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
      mx="3"
      onPress={() => {
        router.navigate({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      style={[styles.main, style]}
    >
      {post.type === 'video' && post.media.video ? (
        <PostVideoCard
          margin={margin}
          nsfw={post.nsfw}
          video={post.media.video}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'image' && post.media.images ? (
        <PostGalleryCard
          images={post.media.images}
          margin={margin}
          nsfw={post.nsfw}
          recyclingKey={post.id}
        />
      ) : null}

      {post.type === 'link' && post.url ? (
        <PostLinkCard
          margin={margin + theme.space[5]}
          post={post}
          style={styles.header}
        />
      ) : null}

      <View gap="3" p="3">
        <Text lines={3} weight="medium">
          {post.title}
        </Text>

        <View align="center" direction="row" gap="4">
          <Pressable
            align="center"
            direction="row"
            gap="2"
            hitSlop={theme.space[4]}
            onPress={() => {
              router.push(`/communities/${post.subreddit}`)
            }}
          >
            <Icon
              color={theme.colors.accent.a9}
              name="ArrowsSplit"
              size={theme.typography[2].lineHeight}
              style={styles.crossPost}
            />

            <Text size="2" weight="medium">
              {post.subreddit}
            </Text>
          </Pressable>

          {footer.map((item) => (
            <View align="center" direction="row" gap="2" key={item.key}>
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
  crossPost: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
  header: {
    marginTop: theme.space[3],
  },
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
  },
}))
