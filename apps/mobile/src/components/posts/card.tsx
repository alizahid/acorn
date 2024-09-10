import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CrossPostCard } from './crosspost'
import { PostFooterCard, type PostLabel } from './footer'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  expanded?: boolean
  label?: PostLabel
  post: Post
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  expanded = false,
  label,
  post,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const { styles } = useStyles(stylesheet)

  const body = expanded && post.body

  return (
    <View style={[styles.main, style]}>
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
        <Text
          lines={expanded ? undefined : 2}
          size={expanded ? '4' : undefined}
          weight="bold"
        >
          {post.title}
        </Text>
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
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  body: {
    marginHorizontal: theme.space[3],
  },
  expanded: {
    marginBottom: theme.space[3],
  },
  main: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.a2,
    maxWidth: runtime.screen.width > 800 ? 600 : undefined,
    width: '100%',
  },
}))
