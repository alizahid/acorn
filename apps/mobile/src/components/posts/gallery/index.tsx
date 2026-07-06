import { Image } from 'expo-image'
import { useCallback } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { useHistory } from '~/hooks/history'
import { useImagePlaceholder, useImagePreview } from '~/hooks/image'
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
  onLongPress?: () => void
}

export function PostGalleryCard({
  compact,
  images,
  large,
  nsfw,
  recyclingKey,
  spoiler,
  onLongPress,
}: Props) {
  const { blurNsfw, blurSpoiler, seenOnMedia } = usePreferences([
    'blurNsfw',
    'blurSpoiler',
    'seenOnMedia',
  ])
  const { addPost } = useHistory()

  const a11y = useTranslations('a11y')

  styles.useVariants({
    compact,
    large,
  })

  const placeholder = useImagePlaceholder()
  const { preview } = useImagePreview()

  const [first] = images

  const onPress = useCallback(
    (initial?: number) => {
      preview(images, initial)

      if (recyclingKey && seenOnMedia) {
        addPost({
          id: recyclingKey,
        })
      }
    },
    [addPost, images, recyclingKey, seenOnMedia, preview],
  )

  if (!first) {
    return null
  }

  if (compact) {
    return (
      <Pressable
        accessibilityLabel={a11y('viewImage')}
        onLongPress={onLongPress}
        onPress={() => {
          onPress()
        }}
        style={styles.main}
      >
        <Image
          {...placeholder}
          accessibilityIgnoresInvertColors
          recyclingKey={recyclingKey}
          source={first.thumbnail}
          style={styles.image}
        />

        {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
          <GalleryBlur />
        ) : null}
      </Pressable>
    )
  }

  return (
    <View style={styles.main}>
      <ImageGrid
        images={images}
        nsfw={Boolean(nsfw && blurNsfw)}
        onLongPress={onLongPress}
        onPress={(initial) => {
          onPress(initial)
        }}
        recyclingKey={recyclingKey}
        spoiler={Boolean(spoiler && blurSpoiler)}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  image: {
    flex: 1,
  },
  main: {
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
    variants: {
      compact: {
        default: {
          marginHorizontal: -theme.space[3],
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
