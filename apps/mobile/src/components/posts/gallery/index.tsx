import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'
import { useCallback } from 'react'
import { View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Gallery } from '~/components/common/gallery'
import { useHistory } from '~/hooks/history'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from './blur'
import { ImageGrid } from './grid'

type Props = {
  compact?: boolean
  images: Array<PostMedia>
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
}

export function PostGalleryCard({
  compact,
  images,
  large,
  nsfw,
  recyclingKey,
  spoiler,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { theme } = useUnistyles()

  const { addPost } = useHistory()

  const { blurNsfw, blurSpoiler, seenOnMedia } = usePreferences(
    useShallow((state) => ({
      blurNsfw: state.blurNsfw,
      blurSpoiler: state.blurSpoiler,
      seenOnMedia: state.seenOnMedia,
    })),
  )

  styles.useVariants({
    compact,
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
      <Galeria
        closeIconName="xmark"
        theme={theme.variant}
        urls={images.map((image) => image.url)}
      >
        <View style={styles.main}>
          {images.map((image, index) => (
            <Galeria.Image
              index={index}
              key={image.url}
              onDismiss={onDismiss}
              onLongPress={() => {
                Gallery.call({
                  type: 'image',
                  url: image.url,
                })
              }}
            >
              <Image
                accessibilityIgnoresInvertColors
                recyclingKey={recyclingKey}
                source={image.thumbnail}
                style={styles.image}
              />
            </Galeria.Image>
          ))}

          {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
            <GalleryBlur compact label={t(spoiler ? 'spoiler' : 'nsfw')} />
          ) : null}
        </View>
      </Galeria>
    )
  }

  return (
    <View style={styles.main}>
      <ImageGrid
        images={images}
        nsfw={nsfw}
        onDismiss={onDismiss}
        recyclingKey={recyclingKey}
        spoiler={spoiler}
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
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    marginHorizontal: -theme.space[3],
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
    variants: {
      compact: {
        false: {
          justifyContent: 'center',
        },
        true: {
          backgroundColor: theme.colors.gray.uiActive,
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
