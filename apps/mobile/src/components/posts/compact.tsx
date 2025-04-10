import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CrossPostCard } from './crosspost'
import { PostCommunity } from './footer/community'
import { PostMeta } from './footer/meta'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  expanded?: boolean
  onPress: () => void
  post: Post
  side?: 'left' | 'right'
  viewing?: boolean
}

export function PostCompactCard({
  expanded,
  onPress,
  post,
  side = 'left',
  viewing,
}: Props) {
  const a11y = useTranslations('a11y')

  const { fontSizePost, largeThumbnails } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <Pressable
      delayed
      direction={side === 'right' ? 'row-reverse' : 'row'}
      disabled={expanded}
      gap="3"
      label={a11y('viewPost')}
      onPress={onPress}
      p="3"
      style={styles.main}
    >
      {post.type === 'crosspost' && post.crossPost ? (
        <CrossPostCard
          compact
          large={largeThumbnails}
          post={post.crossPost}
          recyclingKey={post.id}
          viewing={false}
        />
      ) : null}

      {post.type === 'video' && post.media.video ? (
        <PostVideoCard
          compact
          large={largeThumbnails}
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
          large={largeThumbnails}
          nsfw={post.nsfw}
          recyclingKey={post.id}
          spoiler={post.spoiler}
          viewing={viewing}
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

      <View align="start" flex={1} gap="2">
        <PostCommunity post={post} />

        <Text size={fontSizePost} weight="bold">
          {post.title}
        </Text>

        <PostMeta post={post} />
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
}))
