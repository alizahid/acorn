import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getDimensions } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  margin?: number
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function PostVideoCard({ margin = 0, style, video, viewing }: Props) {
  const frame = useSafeAreaFrame()

  const ref = useRef<VideoView>(null)

  const { muted, updatePreferences } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const opacity = useSharedValue(0)

  const [playing, setPlaying] = useState(false)

  const frameWidth = frame.width - margin

  const player = useVideoPlayer(video.url, (instance) => {
    instance.muted = true
    instance.loop = true

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    const subscription = player.addListener('playingChange', (isPlaying) => {
      setPlaying(isPlaying)
    })

    return () => {
      subscription.remove()
    }
  }, [player])

  useEffect(() => {
    player.muted = !viewing || muted

    if (viewing) {
      player.play()
    } else {
      player.pause()
    }
  }, [muted, player, viewing])

  const controls = [
    {
      icon: 'Rewind',
      key: 'rewind',
      onPress() {
        player.seekBy(-10)
      },
    },
    {
      icon: playing ? 'Pause' : 'Play',
      key: 'pause',
      onPress() {
        if (playing) {
          player.pause()
        } else {
          player.play()
        }
      },
    },
    {
      icon: 'FastForward',
      key: 'forward',
      onPress() {
        player.seekBy(10)
      },
    },
  ] as const

  const dimensions = getDimensions(frameWidth, video)

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <View style={[styles.main, style]}>
      <Pressable
        onPress={() => {
          opacity.value = withTiming(opacity.value === 1 ? 0 : 1, {
            duration: 250,
          })
        }}
        without
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          nativeControls={false}
          player={player}
          ref={ref}
          style={styles.video(dimensions.height, dimensions.width)}
        />
      </Pressable>

      <Animated.View style={[styles.controls, controlsStyle]}>
        {controls.map((control) => (
          <Pressable
            key={control.key}
            onPress={control.onPress}
            style={styles.control}
          >
            <Icon
              color={theme.colors.white.a11}
              name={control.icon}
              size={theme.space[5]}
            />
          </Pressable>
        ))}
      </Animated.View>

      <Pressable
        onPress={() => {
          updatePreferences({
            muted: !muted,
          })
        }}
        style={[styles.control, styles.volume]}
      >
        <Icon
          color={theme.colors.white.a11}
          name={muted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
          size={theme.space[4]}
        />
      </Pressable>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  control: {
    backgroundColor: theme.colors.black.a9,
    borderRadius: theme.space[5],
    padding: theme.space[3],
  },
  controls: {
    bottom: theme.space[4],
    flexDirection: 'row',
    gap: theme.space[2],
    justifyContent: 'center',
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
  },
  main: {
    backgroundColor: theme.colors.gray.a2,
  },
  video: (height: number, width: number) => ({
    height,
    width,
  }),
  volume: {
    bottom: theme.space[4],
    padding: theme.space[2],
    position: 'absolute',
    right: theme.space[4],
  },
}))
