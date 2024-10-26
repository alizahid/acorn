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

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { CrossPostCard } from './crosspost'
import { PostFooterCard, type PostLabel } from './footer'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  expanded?: boolean
  label?: PostLabel
  post: Post
  seen?: boolean
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  expanded = false,
  label,
  post,
  seen = false,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const opacity = useSharedValue(seen ? 0.5 : 1)

  const { styles } = useStyles(stylesheet)

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
}))
