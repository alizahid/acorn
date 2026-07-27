import { ImageBackground } from 'expo-image'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { useFocused } from '~/hooks/focus'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'
import { VideoPlayer } from './player'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  spoiler?: boolean
  thumbnail?: string
  video: PostMedia
  viewing: boolean
}

export function VideoPlaceholder({
  compact = false,
  crossPost = false,
  large = false,
  nsfw,
  recyclingKey,
  spoiler,
  thumbnail,
  video,
  viewing,
}: Props) {
  const { blurNsfw, blurSpoiler } = usePreferences(
    useShallow((state) => ({
      blurNsfw: state.blurNsfw,
      blurSpoiler: state.blurSpoiler,
    })),
  )

  const { focused } = useFocused()

  styles.useVariants({
    compact,
    crossPost,
    large,
  })

  return (
    <ImageBackground
      accessibilityIgnoresInvertColors
      source={thumbnail ?? video.thumbnail}
      style={styles.main}
    >
      {focused && viewing ? (
        <VideoPlayer
          compact={compact}
          nsfw={nsfw}
          recyclingKey={recyclingKey}
          spoiler={spoiler}
          video={video}
        />
      ) : (
        <View style={styles.video(video.width / video.height)}>
          {(nsfw && blurNsfw) || (spoiler && blurSpoiler) ? (
            <GalleryBlur compact={compact} />
          ) : null}
        </View>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create((theme) => ({
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
    justifyContent: 'center',
    maxHeight: iPad ? 600 : 400,
    overflow: 'hidden',
    variants: {
      compact: {
        true: {},
      },
      crossPost: {
        true: {},
      },
      large: {
        true: {},
      },
    },
  },
  video: (aspectRatio: number) => ({
    aspectRatio,
    variants: {
      compact: {
        true: {
          ...StyleSheet.absoluteFill,
          aspectRatio: 1,
          backgroundColor: theme.colors.black.accentAlpha,
        },
      },
    },
  }),
}))
