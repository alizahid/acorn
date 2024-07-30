import { useRouter } from 'expo-router'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Post } from '~/types/post'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { CrossPostCard } from './crosspost'
import { PostFooterCard } from './footer'
import { PostImageCard } from './image'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  body?: boolean
  linkable?: boolean
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  body,
  linkable = true,
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
        disabled={!linkable}
        onPress={() => {
          router.navigate(`/posts/${post.id}`)
        }}
        style={styles.title}
      >
        <Text highContrast={!post.read} weight="bold">
          {post.title}
        </Text>
      </Pressable>

      {post.type === 'link' ? (
        <PostLinkCard margin={margin} post={post} />
      ) : post.crossPost ? (
        <CrossPostCard
          margin={margin}
          post={post.crossPost}
          viewing={viewing}
        />
      ) : post.media.video ? (
        <PostVideoCard
          key={post.id}
          margin={margin}
          video={post.media.video}
          viewing={viewing}
        />
      ) : post.media.images ? (
        <PostImageCard
          images={post.media.images}
          key={post.id}
          margin={margin}
        />
      ) : null}

      {body && post.body ? (
        <View style={styles.body}>
          <Markdown margin={margin + theme.space[5]} meta={post.media.meta}>
            {post.body}
          </Markdown>
        </View>
      ) : null}

      <PostFooterCard linkable={linkable} post={post} />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[3] / 2,
  },
  title: {
    padding: theme.space[3],
  },
}))
