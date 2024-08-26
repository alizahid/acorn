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

  const body = expanded && post.body

  return (
    <View style={style}>
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
        <Text highContrast={!post.read} weight="bold">
          {post.title}
        </Text>
      </Pressable>

      {post.type === 'crosspost' && post.crossPost ? (
        <CrossPostCard
          margin={margin + theme.space[5]}
          post={post.crossPost}
          style={body ? styles.expanded : null}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'video' && post.media.video ? (
        <PostVideoCard
          margin={margin}
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
          margin={margin}
          nsfw={post.nsfw}
          recyclingKey={post.id}
          style={body ? styles.expanded : null}
        />
      ) : null}

      {post.type === 'link' && post.url ? (
        <PostLinkCard
          margin={margin + theme.space[5]}
          media={post.media.images?.[0]}
          recyclingKey={post.id}
          style={body ? styles.expanded : null}
          url={post.url}
        />
      ) : null}

      {expanded && post.body ? (
        <Markdown
          margin={margin + theme.space[5]}
          meta={post.media.meta}
          recyclingKey={post.id}
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
    marginHorizontal: theme.space[3],
  },
  expanded: {
    marginBottom: theme.space[3],
  },
}))
