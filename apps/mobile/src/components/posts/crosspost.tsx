import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CrossPostFooter } from './footer/crosspost'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  compact?: boolean
  large?: boolean
  post: Post
  recyclingKey?: string
}

export function CrossPostCard({ compact, large, post, recyclingKey }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  const { themeOled } = usePreferences()

  styles.useVariants({
    large,
    oled: themeOled,
  })

  if (compact) {
    return (
      <Pressable
        accessibilityHint={a11y('viewPost')}
        accessibilityLabel={post.title}
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

        <View align="center" justify="center" style={styles.icon}>
          <Icon name="arrow.trianglehead.branch" style={styles.crossPost} />
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable
      accessibilityHint={a11y('viewPost')}
      accessibilityLabel={post.title}
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
          recyclingKey={recyclingKey}
          spoiler={post.spoiler}
          thumbnail={post.media.images?.[0]?.url}
          video={post.media.video}
        />
      ) : null}

      {post.type === 'image' && post.media.images ? (
        <View mx="3">
          <PostGalleryCard
            images={post.media.images}
            nsfw={post.nsfw}
            recyclingKey={recyclingKey}
            spoiler={post.spoiler}
          />
        </View>
      ) : null}

      {post.type === 'link' && post.url ? (
        <View mx="3">
          <PostLinkCard
            crossPost
            media={post.media.images?.[0]}
            recyclingKey={recyclingKey}
            url={post.url}
          />
        </View>
      ) : null}

      <View gap="3" p="3">
        <Text numberOfLines={2} size="2" weight="medium">
          {post.title}
        </Text>

        <CrossPostFooter post={post} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  crossPost: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
  icon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.accentAlpha,
  },
  image: {
    flex: 1,
  },
  main: {
    backgroundColor: theme.colors.gray.uiHover,
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
      oled: {
        true: {
          backgroundColor: theme.colors.gray.bg,
        },
      },
    },
  },
}))
