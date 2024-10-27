import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { cardMaxWidth, iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CrossPostCard } from './crosspost'
import {
  PostCommunity,
  PostFooterCard,
  type PostLabel,
  PostMeta,
} from './footer'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  compact?: boolean
  expanded?: boolean
  label?: PostLabel
  post: Post
  reverse?: boolean
  seen?: boolean
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  compact = false,
  expanded = false,
  label,
  post,
  reverse = false,
  seen = false,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const opacity = useSharedValue(seen ? 0.5 : 1)

  const { styles, theme } = useStyles(stylesheet)

  const body = expanded && post.body

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  useEffect(() => {
    const next = seen ? 0.5 : 1

    if (opacity.get() === next) {
      return
    }

    opacity.set(() => withTiming(next))
  }, [opacity, seen])

  if (compact) {
    return (
      <Animated.View style={[styles.main, style, animatedStyle]}>
        <Pressable
          direction={reverse ? 'row-reverse' : 'row'}
          disabled={expanded}
          gap="3"
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
          {post.type === 'video' && post.media.video ? (
            <View>
              <Image source={post.media.video.thumbnail} style={styles.thumb} />

              <View
                align="center"
                justify="center"
                style={[styles.thumb, styles.play]}
              >
                <Icon
                  color={theme.colors.white.a12}
                  name="Play"
                  weight="fill"
                />
              </View>
            </View>
          ) : null}

          {post.type === 'image' && post.media.images ? (
            <Image
              source={post.media.images[0]?.thumbnail}
              style={styles.thumb}
            />
          ) : null}

          {post.type === 'crosspost' && post.crossPost ? (
            post.crossPost.media.images ? (
              <Image
                source={post.crossPost.media.images[0]?.thumbnail}
                style={styles.thumb}
              />
            ) : (
              <View align="center" justify="center" style={styles.thumb}>
                <Icon
                  color={theme.colors.accent.a9}
                  name="ArrowsSplit"
                  style={styles.crossPost}
                  weight="fill"
                />
              </View>
            )
          ) : null}

          <View align="start" flex={1} gap="3">
            <PostCommunity label={label} post={post} />

            <Text weight="bold">{post.title}</Text>

            <PostMeta post={post} />
          </View>
        </Pressable>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[styles.main, style, animatedStyle]}>
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
        p="3"
      >
        <Text weight="bold">{post.title}</Text>
      </Pressable>

      {post.type === 'crosspost' && post.crossPost ? (
        <CrossPostCard
          post={post.crossPost}
          style={body ? styles.expanded : null}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'video' && post.media.video ? (
        <PostVideoCard
          nsfw={post.nsfw}
          recyclingKey={post.id}
          style={body ? styles.expanded : null}
          video={post.media.video}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'image' && post.media.images ? (
        <PostGalleryCard
          images={post.media.images}
          nsfw={post.nsfw}
          recyclingKey={post.id}
          style={body ? styles.expanded : null}
        />
      ) : null}

      {post.type === 'link' && post.url ? (
        <PostLinkCard
          media={post.media.images?.[0]}
          recyclingKey={post.id}
          style={body ? styles.expanded : null}
          url={post.url}
        />
      ) : null}

      {expanded && post.body ? (
        <Markdown
          meta={post.media.meta}
          recyclingKey={post.id}
          size="2"
          style={styles.body}
          variant="post"
        >
          {post.body}
        </Markdown>
      ) : null}

      <PostFooterCard expanded={expanded} label={label} post={post} />
    </Animated.View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginHorizontal: theme.space[3],
  },
  crossPost: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
  expanded: {
    marginBottom: theme.space[3],
  },
  main: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: iPad ? theme.radius[3] : undefined,
    maxWidth: iPad ? cardMaxWidth : undefined,
    width: '100%',
  },
  play: {
    backgroundColor: theme.colors.black.a6,
    position: 'absolute',
  },
  thumb: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    height: theme.space[8],
    width: theme.space[8],
  },
}))
