import { Image } from 'expo-image'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Gallery } from 'react-native-jet-gallery'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { MediaMenu } from '~/components/common/media-menu'
// import { Gallery } from '~/components/common/gallery'
import { useHistory } from '~/hooks/history'
import { useImageActions } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from './blur'
import { ImageGrid } from './grid'

type Props = {
  compact?: boolean
  crossPost?: boolean
  images: Array<PostMedia>
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
}

export function PostGalleryCard({
  compact = false,
  crossPost = false,
  images,
  large,
  nsfw,
  recyclingKey,
  spoiler,
}: Props) {
  const t = useTranslations('component.posts.gallery')

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
    crossPost,
    large,
  })

  const { actions } = useImageActions()

  const onDismiss = useCallback(() => {
    if (recyclingKey && seenOnMedia) {
      addPost({
        id: recyclingKey,
      })
    }
  }, [addPost, recyclingKey, seenOnMedia])

  if (compact) {
    return (
      <View style={styles.main}>
        <Gallery actions={actions} images={images} onDismiss={onDismiss}>
          {images.map((image, index) => (
            <Gallery.Image
              index={index}
              key={image.url}
              onLongPress={(event) => {
                MediaMenu.call({
                  type: 'image',
                  url: event.url,
                })
              }}
            >
              <Image
                accessibilityIgnoresInvertColors
                recyclingKey={recyclingKey}
                source={image.thumbnail}
                style={styles.image}
              />
            </Gallery.Image>
          ))}

          {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
            <GalleryBlur compact label={t(spoiler ? 'spoiler' : 'nsfw')} />
          ) : null}
        </Gallery>
      </View>
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
    compoundVariants: [
      {
        compact: false,
        crossPost: false,
        styles: {
          marginHorizontal: -theme.space[3],
        },
      },
      {
        compact: true,
        large: true,
        styles: {
          borderRadius: theme.space[1] * 2,
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
      },
      {
        compact: true,
        large: false,
        styles: {
          borderRadius: theme.space[1],
          height: theme.space[8],
          width: theme.space[8],
        },
      },
    ],
    maxHeight: runtime.screen.height * 0.4,
    overflow: 'hidden',
    variants: {
      compact: {
        true: {
          backgroundColor: theme.colors.gray.uiActive,
        },
      },
      crossPost: {
        true: {},
      },
      large: {
        true: {},
      },
    },
  },
}))
