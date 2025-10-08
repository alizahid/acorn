import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CrossPostCard } from './crosspost'
import { PostCommunity } from './footer/community'
import { PostMeta } from './footer/meta'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  post: Post
  side?: 'left' | 'right'
  style?: StyleProp<ViewStyle>
}

export function PostCompactCard({ post, side = 'left', style }: Props) {
  const { boldTitle, communityOnTop, fontSizePostTitle, largeThumbnails } =
    usePreferences()

  styles.useVariants({
    large: largeThumbnails,
  })

  return (
    <View
      align="start"
      direction={side === 'right' ? 'row-reverse' : 'row'}
      gap="3"
      style={[styles.main, style]}
    >
      <View>
        {post.type === 'crosspost' && post.crossPost ? (
          <CrossPostCard
            compact
            large={largeThumbnails}
            post={post.crossPost}
            recyclingKey={post.id}
          />
        ) : null}

        {post.type === 'video' && post.media.video ? (
          <PostVideoCard
            compact
            large={largeThumbnails}
            nsfw={post.nsfw}
            recyclingKey={post.id}
            thumbnail={post.media.images?.[0]?.url}
            video={post.media.video}
          />
        ) : null}

        {post.type === 'image' && post.media.images ? (
          <PostGalleryCard
            compact
            images={post.media.images}
            large={largeThumbnails}
            nsfw={post.nsfw}
            recyclingKey={post.id}
            spoiler={post.spoiler}
          />
        ) : null}

        {post.type === 'link' && post.url ? (
          <PostLinkCard
            compact
            large={largeThumbnails}
            media={post.media.images?.[0]}
            recyclingKey={post.id}
            url={post.url}
          />
        ) : null}

        {post.type === 'text' ? (
          <View align="center" justify="center" style={styles.text}>
            <Icon name="text.alignleft" />
          </View>
        ) : null}
      </View>

      <View align="start" flex={1} gap="2">
        {communityOnTop ? <PostCommunity post={post} /> : null}

        <Text size={fontSizePostTitle} weight={boldTitle ? 'bold' : undefined}>
          {post.title}
        </Text>

        {communityOnTop ? null : <PostCommunity post={post} />}

        <PostMeta post={post} />
      </View>

      {post.saved ? <View pointerEvents="none" style={styles.saved} /> : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    overflow: 'hidden',
  },
  saved: {
    backgroundColor: theme.colors.green.accent,
    bottom: -theme.space[6],
    height: theme.space[8],
    position: 'absolute',
    right: -theme.space[6],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[8],
  },
  text: {
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    overflow: 'hidden',
    variants: {
      large: {
        false: {
          borderRadius: theme.space[1],
          height: theme.space[8],
          width: theme.space[8],
        },
        true: {
          borderRadius: theme.space[2],
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
      },
    },
  },
}))
