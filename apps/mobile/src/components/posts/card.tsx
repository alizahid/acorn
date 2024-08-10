import { useRouter } from 'expo-router'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

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
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  expanded = false,
  label,
  margin = 0,
  post,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={style}>
      <Pressable
        disabled={expanded}
        onPress={() => {
          router.navigate(`/posts/${post.id}`)
        }}
        style={styles.title}
      >
        <Text highContrast={!post.read} weight="bold">
          {post.title}
        </Text>
      </Pressable>

      {post.type === 'crosspost' && post.crossPost ? (
        <CrossPostCard
          margin={margin + theme.space[5]}
          post={post.crossPost}
          viewing={viewing}
        />
      ) : null}

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

      {post.type === 'link' && post.url ? (
        <PostLinkCard margin={margin + theme.space[5]} post={post} />
      ) : null}

      {expanded && post.body ? (
        <Markdown
          margin={margin + theme.space[5]}
          meta={post.media.meta}
          size="2"
          style={styles.body}
        >
          {post.body}
        </Markdown>
      ) : null}

      <PostFooterCard expanded={expanded} label={label} post={post} />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    padding: theme.space[3],
  },
  title: {
    padding: theme.space[3],
  },
}))
