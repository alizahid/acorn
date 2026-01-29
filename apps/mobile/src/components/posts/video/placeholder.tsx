import { ImageBackground } from 'expo-image'
import { useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { VisibilitySensor } from '~/components/common/sensor/visibility'
import { View } from '~/components/common/view'
import { useFocused } from '~/hooks/focus'
import { type PostMedia } from '~/types/post'

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
}: Props) {
  const { focused } = useFocused()

  styles.useVariants({
    compact,
    crossPost,
    large,
  })

  const [visible, setVisible] = useState(false)

  return (
    <VisibilitySensor
      id={video.url}
      onChange={(next) => {
        setVisible(next.visible)
      }}
    >
      <ImageBackground
        accessibilityIgnoresInvertColors
        source={thumbnail ?? video.thumbnail}
        style={styles.main}
      >
        {focused && visible ? (
          <VideoPlayer
            compact={compact}
            nsfw={nsfw}
            recyclingKey={recyclingKey}
            spoiler={spoiler}
            video={video}
          />
        ) : (
          <View style={styles.video(video.width / video.height)} />
        )}
      </ImageBackground>
    </VisibilitySensor>
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
    variants: {
      compact: {
        default: {
          aspectRatio,
        },
        true: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: theme.colors.black.accentAlpha,
        },
      },
    },
  }),
}))
