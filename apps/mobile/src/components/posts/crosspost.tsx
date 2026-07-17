import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { CrossPostFooter } from './footer/crosspost'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  compact?: boolean
  large?: boolean
  onLongPress?: () => void
  post: Post
  recyclingKey?: string
  viewing: boolean
}

export function CrossPostCard({
  compact,
  large,
  onLongPress,
  post,
  recyclingKey,
  viewing,
}: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  styles.useVariants({
    large,
  })

  if (compact) {
    return (
      <Pressable
        accessibilityHint={a11y('viewPost')}
        accessibilityLabel={post.title}
        onLongPress={onLongPress}
        onPress={() => {
          router.navigate({
            params: {
              id: removePrefix(post.id),
            },
            pathname: '/posts/[id]',
          })
        }}
        style={styles.main}
      >
        {post.media.images?.[0] ? (
          <Image
            accessibilityIgnoresInvertColors
            source={post.media.images[0].thumbnail}
            style={styles.image}
          />
        ) : null}

        <View style={styles.icon}>
          <Icon name="shuffle" />
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable
      accessibilityHint={a11y('viewPost')}
      accessibilityLabel={post.title}
      onLongPress={onLongPress}
      onPress={() => {
        router.navigate({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      style={styles.main}
    >
      {post.type === 'video' && post.media.video ? (
        <PostVideoCard
          crossPost
          nsfw={post.nsfw}
          onLongPress={onLongPress}
          recyclingKey={recyclingKey}
          spoiler={post.spoiler}
          thumbnail={post.media.images?.[0]?.url}
          video={post.media.video}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'image' && post.media.images ? (
        <PostGalleryCard
          images={post.media.images}
          nsfw={post.nsfw}
          onLongPress={onLongPress}
          recyclingKey={recyclingKey}
          spoiler={post.spoiler}
        />
      ) : null}

      {post.type === 'link' && post.url ? (
        <PostLinkCard
          crossPost
          media={post.media.images?.[0]}
          onLongPress={onLongPress}
          recyclingKey={recyclingKey}
          url={post.url}
        />
      ) : null}

      <View style={styles.footer}>
        <Text numberOfLines={2} size="2" weight="medium">
          {post.title}
        </Text>

        <CrossPostFooter post={post} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  footer: {
    gap: theme.space[3],
    padding: theme.space[3],
  },
  icon: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: theme.colors.black.accentAlpha,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
  },
  main: {
    backgroundColor: theme.colors.gray.bgAlt,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
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
