import { Image } from 'expo-image'
import { useCallback } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { previewImages } from '~/lib/preview'
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
}

export function PostGalleryCard({
  compact,
  images,
  large,
  nsfw,
  recyclingKey,
  spoiler,
}: Props) {
  const { blurNsfw, blurSpoiler, seenOnMedia } = usePreferences()
  const { addPost } = useHistory()

  const a11y = useTranslations('a11y')

  styles.useVariants({
    compact,
    large,
  })

  const placeholder = useImagePlaceholder()

  const first = images[0]

  const onPress = useCallback(
    (initial?: number) => {
      previewImages(images, initial)

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
      <ImageMenu url={first.url}>
        <Pressable
          accessibilityLabel={a11y('viewImage')}
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

          {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
            <GalleryBlur />
          ) : null}
        </Pressable>
      </ImageMenu>
    )
  }

  return (
    <View style={styles.main}>
      <ImageGrid
        images={images}
        nsfw={Boolean(nsfw && blurNsfw)}
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
