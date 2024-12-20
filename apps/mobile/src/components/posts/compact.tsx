import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { iPad } from '~/lib/common'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CrossPostCard } from './crosspost'
import { type PostLabel } from './footer'
import { PostCommunity } from './footer/community'
import { PostMeta } from './footer/meta'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  expanded?: boolean
  label?: PostLabel
  onPress: () => void
  post: Post
  seen?: boolean
  side?: 'left' | 'right'
}

export function PostCompactCard({
  expanded,
  label,
  onPress,
  post,
  seen,
  side = 'left',
}: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <Pressable
      direction={side === 'right' ? 'row-reverse' : 'row'}
      disabled={expanded}
      gap="3"
      onPress={onPress}
      p="3"
      style={styles.main}
    >
      {post.type === 'crosspost' && post.crossPost ? (
        <CrossPostCard
          compact
          post={post.crossPost}
          recyclingKey={post.id}
          viewing={false}
        />
      ) : null}

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

      <View align="start" flex={1} gap="2">
        <Text highContrast={!seen} weight="bold">
          {post.title}
        </Text>

        <View align="center" direction="row" gap="3">
          <PostCommunity image={false} label={label} post={post} seen={seen} />

          <PostMeta post={post} seen={seen} />
        </View>
      </View>

      {post.saved ? <View pointerEvents="none" style={styles.saved} /> : null}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    overflow: 'hidden',
  },
  saved: {
    backgroundColor: theme.colors.green[9],
    bottom: -theme.space[iPad ? 5 : 4],
    height: theme.space[iPad ? 8 : 6],
    position: 'absolute',
    right: -theme.space[iPad ? 5 : 4],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[iPad ? 8 : 6],
  },
}))
