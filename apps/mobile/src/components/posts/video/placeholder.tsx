import { ImageBackground } from 'expo-image'
import { useState } from 'react'
import { View } from 'react-native'
import { InView } from 'react-native-intersection-observer'
import { StyleSheet } from 'react-native-unistyles'

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
  onLongPress?: () => void
}

export function VideoPlaceholder({
  compact,
  crossPost,
  large,
  nsfw,
  recyclingKey,
  spoiler,
  thumbnail,
  video,
  onLongPress,
}: Props) {
  const { blurNsfw, blurSpoiler } = usePreferences(['blurNsfw', 'blurSpoiler'])

  const { focused } = useFocused()

  styles.useVariants({
    compact,
    crossPost,
    iPad,
    large,
  })

  const [visible, setVisible] = useState(false)

  return (
    <InView onChange={setVisible}>
      <ImageBackground
        accessibilityIgnoresInvertColors
        source={thumbnail ?? video.thumbnail}
        style={styles.main}
      >
        {focused && visible ? (
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
              <GalleryBlur />
            ) : null}
          </View>
        )}
      </ImageBackground>
    </InView>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  main: {
    backgroundColor: theme.colors.black.accentAlpha,
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
          borderCurve: 'continuous',
        },
      },
      crossPost: {
        true: {
          marginHorizontal: 0,
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
