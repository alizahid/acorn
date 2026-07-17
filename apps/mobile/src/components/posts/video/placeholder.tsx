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
  large?: boolean
  nsfw?: boolean
  onLongPress?: () => void
  recyclingKey?: string
  spoiler?: boolean
  thumbnail?: string
  video: PostMedia
  viewing: boolean
}

export function VideoPlaceholder({
  compact,
  large,
  nsfw,
  onLongPress,
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
    iPad,
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
          onLongPress={onLongPress}
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

const styles = StyleSheet.create((theme, runtime) => ({
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
    variants: {
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
          borderRadius: theme.space[1] * 2,
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
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
