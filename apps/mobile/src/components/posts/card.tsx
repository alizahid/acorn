import { useRouter } from 'expo-router'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type FeedType, type TopInterval } from '~/hooks/queries/posts/posts'
import { getPostUrl } from '~/lib/url'
import { type Post } from '~/types/post'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { PostFooterCard } from './footer'
import { PostImagesCard } from './images'
import { PostVideoCard } from './video'

type Props = {
  body?: boolean
  feedType?: FeedType
  interval?: TopInterval
  linkable?: boolean
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
  subreddit?: string
  viewing: boolean
}

export function PostCard({
  body,
  feedType,
  interval,
  linkable = true,
  margin = 0,
  post,
  style,
  subreddit,
  viewing,
}: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={[styles.main, style]}>
      <Pressable
        disabled={!linkable}
        onPress={() => {
          router.navigate(getPostUrl(post.id, feedType))
        }}
        style={styles.title}
      >
        <Text highContrast={!post.read} weight="bold">
          {post.title}
        </Text>
      </Pressable>

      {post.media.video ? (
        <PostVideoCard
          key={post.id}
          video={post.media.video}
          viewing={viewing}
        />
      ) : post.media.images ? (
        <PostImagesCard images={post.media.images} key={post.id} />
      ) : null}

      {body && post.body ? (
        <View style={styles.body}>
          <Markdown margin={margin + theme.space[5]} meta={post.media.meta}>
            {post.body}
          </Markdown>
        </View>
      ) : null}

      <PostFooterCard
        feedType={feedType}
        interval={interval}
        post={post}
        subreddit={subreddit}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[3] / 2,
  },
  main: {
    backgroundColor: theme.colors.gray.a2,
  },
  title: {
    padding: theme.space[3],
  },
}))
