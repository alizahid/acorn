import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'
import { useCallback } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHistory } from '~/hooks/history'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from './blur'
import { ImageGrid } from './grid'

type Props = {
  compact?: boolean
  images: Array<PostMedia>
  large?: boolean
  nsfw?: boolean
  onLongPress?: () => void
  recyclingKey?: string
  spoiler?: boolean
}

export function PostGalleryCard({
  compact,
  images,
  large,
  nsfw,
  onLongPress,
  recyclingKey,
  spoiler,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { addPost } = useHistory()

  const { blurNsfw, blurSpoiler, seenOnMedia } = usePreferences((state) => ({
    blurNsfw: state.blurNsfw,
    blurSpoiler: state.blurSpoiler,
    seenOnMedia: state.seenOnMedia,
  }))

  styles.useVariants({
    compact,
    iPad,
    large,
  })

  const onDismiss = useCallback(() => {
    if (recyclingKey && seenOnMedia) {
      addPost({
        id: recyclingKey,
      })
    }
  }, [addPost, recyclingKey, seenOnMedia])

  if (compact) {
    return (
      <Galeria closeIconName="xmark" urls={images.map((image) => image.url)}>
        <View style={styles.main}>
          {images.map((image, index) => (
            <Galeria.Image
              index={index}
              key={image.url}
              onDismiss={onDismiss}
              onLongPress={onLongPress}
            >
              <Image
                accessibilityIgnoresInvertColors
                recyclingKey={recyclingKey}
                source={image.thumbnail}
                style={styles.image}
              />
            </Galeria.Image>
          ))}

          {nsfw || spoiler ? (
            <GalleryBlur label={t(spoiler ? 'spoiler' : 'nsfw')} />
          ) : null}
        </View>
      </Galeria>
    )
  }

  return (
    <View style={styles.main}>
      <ImageGrid
        images={images}
        nsfw={Boolean(nsfw && blurNsfw)}
        onDismiss={onDismiss}
        onLongPress={onLongPress}
        recyclingKey={recyclingKey}
        spoiler={Boolean(spoiler && blurSpoiler)}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  image: {
    height: '100%',
    width: '100%',
  },
  main: {
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
    variants: {
      compact: {
        default: {
          marginHorizontal: -theme.space[3],
        },
        false: {
          justifyContent: 'center',
        },
        true: {
          backgroundColor: theme.colors.gray.uiActive,
        },
      },
      iPad: {
        true: {
          borderCurve: 'continuous',
          borderRadius: theme.radius[4],
        },
      },
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
