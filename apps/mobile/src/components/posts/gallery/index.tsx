import { Image } from 'expo-image'
import { useCallback } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Gallery } from '~/components/common/gallery'
import { Pressable } from '~/components/common/pressable'
import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from './blur'
import { ImageGrid } from './grid'
import { ImageMenu } from './menu'

type Props = {
  compact?: boolean
  images: Array<PostMedia>
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
  style?: StyleProp<ViewStyle>
  viewing?: boolean
}

export function PostGalleryCard({
  compact,
  images,
  large,
  nsfw,
  recyclingKey,
  spoiler,
  style,
  viewing,
}: Props) {
  const a11y = useTranslations('a11y')

  const { blurNsfw, blurSpoiler, seenOnMedia } = usePreferences()
  const { addPost } = useHistory()

  const { styles } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const first = images[0]

  const onPress = useCallback(
    (initial?: number) => {
      Gallery.call({
        images,
        initial,
      })

      if (recyclingKey && seenOnMedia) {
        addPost({
          id: recyclingKey,
        })
      }
    },
    [addPost, images, recyclingKey, seenOnMedia],
  )

  if (!first) {
    return null
  }

  if (compact) {
    return (
      <ImageMenu
        image={first}
        onPress={() => {
          onPress()
        }}
      >
        <Pressable
          label={a11y('viewImage')}
          onPress={() => {
            onPress()
          }}
          style={[styles.compact(large), style]}
        >
          <Image
            {...placeholder}
            accessibilityIgnoresInvertColors
            priority={viewing ? 'high' : 'normal'}
            recyclingKey={recyclingKey}
            source={first.thumbnail}
            style={styles.compactImage}
          />

          {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
            <GalleryBlur />
          ) : null}
        </Pressable>
      </ImageMenu>
    )
  }

  return (
    <Pressable label={a11y('viewImage')} style={[styles.main, style]}>
      <ImageGrid
        images={images}
        nsfw={Boolean(nsfw && blurNsfw)}
        onPress={(initial) => {
          onPress(initial)
        }}
        recyclingKey={recyclingKey}
        spoiler={Boolean(spoiler && blurSpoiler)}
        viewing={viewing}
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blur: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  compact: (large?: boolean) => ({
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    borderRadius: theme.space[large ? 2 : 1],
    height: theme.space[8] * (large ? 2 : 1),
    overflow: 'hidden',
    width: theme.space[8] * (large ? 2 : 1),
  }),
  compactIcon: {
    backgroundColor: theme.colors.black.accentAlpha,
  },
  compactImage: {
    flex: 1,
  },
  main: {
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
  },
}))
