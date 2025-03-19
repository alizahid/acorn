import { Image } from 'expo-image'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { Gallery } from '~/sheets/gallery'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Pressable } from '../../common/pressable'
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
  style?: StyleProp<ViewStyle>
  viewing?: boolean
}

export function PostGalleryCard({
  compact,
  images,
  large,
  nsfw,
  onLongPress,
  recyclingKey,
  spoiler,
  style,
  viewing,
}: Props) {
  const { blurNsfw, seenOnMedia } = usePreferences()
  const { addPost } = useHistory()

  const { styles } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const first = images[0]

  if (!first) {
    return null
  }

  if (compact) {
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={() => {
          void Gallery.call({
            images,
          })

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={[styles.compact(large), style]}
      >
        <Image
          {...placeholder}
          priority={viewing ? 'high' : 'normal'}
          recyclingKey={recyclingKey}
          source={first.thumbnail}
          style={styles.compactImage}
        />

        {Boolean(nsfw && blurNsfw) || spoiler ? <GalleryBlur /> : null}
      </Pressable>
    )
  }

  return (
    <Pressable onLongPress={onLongPress} style={[styles.main, style]}>
      <ImageGrid
        images={images}
        nsfw={Boolean(nsfw && blurNsfw)}
        onLongPress={onLongPress}
        onPress={(initial) => {
          void Gallery.call({
            images,
            initial,
          })

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        recyclingKey={recyclingKey}
        spoiler={spoiler}
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
    backgroundColor: theme.colors.gray.ui,
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
