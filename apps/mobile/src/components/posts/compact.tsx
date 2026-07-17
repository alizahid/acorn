import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { cardMaxWidth } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Text } from '../common/text'
import { CrossPostCard } from './crosspost'
import { PostCommunity } from './footer/community'
import { PostMeta } from './footer/meta'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  post: Post
  side?: 'left' | 'right'
  privacy?: boolean
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCompactCard({
  post,
  side = 'left',
  privacy,
  style,
  viewing,
}: Props) {
  const { boldTitle, communityOnTop, fontSizeTitle, largeThumbnails } =
    usePreferences(
      useShallow((state) => ({
        boldTitle: state.boldTitle,
        communityOnTop: state.communityOnTop,
        fontSizeTitle: state.fontSizeTitle,
        largeThumbnails: state.largeThumbnails,
      })),
    )

  styles.useVariants({
    large: largeThumbnails,
  })

  return (
    <View style={[styles.main(side === 'right'), style]}>
      <View>
        {post.type === 'crosspost' && post.crossPost ? (
          <CrossPostCard
            compact
            large={largeThumbnails}
            post={post.crossPost}
            recyclingKey={post.id}
            viewing={viewing}
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
            viewing={viewing}
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
          <View style={styles.text}>
            <Icon name="text-align-left" />
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        {communityOnTop ? <PostCommunity post={post} /> : null}

        <Text size={fontSizeTitle} weight={boldTitle ? 'bold' : undefined}>
          {post.title}
        </Text>

        {communityOnTop ? null : <PostCommunity post={post} />}

        <PostMeta post={post} privacy={privacy} />
      </View>

      {!privacy && post.saved ? (
        <View pointerEvents="none" style={styles.saved} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    flex: 1,
    gap: theme.space[2],
  },
  main: (right: boolean) => ({
    alignSelf: 'center',
    flexDirection: right ? 'row-reverse' : 'row',
    gap: theme.space[3],
    maxWidth: cardMaxWidth,
    overflow: 'hidden',
    padding: theme.space[3],
  }),
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
    alignItems: 'center',
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    justifyContent: 'center',
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
