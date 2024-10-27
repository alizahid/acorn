import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'

import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { PostCommunity, type PostLabel, PostMeta } from './footer'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  expanded?: boolean
  label?: PostLabel
  post: Post
  reverse?: boolean
  style?: StyleProp<ViewStyle>
}

export function PostCompactCard({
  expanded = false,
  label,
  post,
  reverse = false,
  style,
}: Props) {
  const router = useRouter()

  return (
    <Animated.View style={style}>
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
          <PostVideoCard
            compact
            nsfw={post.nsfw}
            recyclingKey={post.id}
            video={post.media.video}
            viewing={false}
          />
        ) : null}

        {post.type === 'image' && post.media.images ? (
          <PostGalleryCard
            compact
            images={post.media.images}
            nsfw={post.nsfw}
            recyclingKey={post.id}
          />
        ) : null}

        {post.type === 'link' && post.url ? (
          <PostLinkCard
            compact
            media={post.media.images?.[0]}
            recyclingKey={post.id}
            url={post.url}
          />
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
