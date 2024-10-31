import { type VideoPlayer } from 'expo-video'
import { useEffect, useState } from 'react'
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'

type Props = {
  muted: boolean
  onMutedChange: (muted: boolean) => void
  opacity: SharedValue<number>
  player: VideoPlayer
}

export function VideoControls({
  muted,
  onMutedChange,
  opacity,
  player,
}: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  const width = useSharedValue(0)

  const [playing, setPlaying] = useState(player.playing)
  const [loading, setLoading] = useState(player.status === 'loading')

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const progress = useAnimatedStyle(() => {
    const value = width.get()

    return {
      width: value <= 0 ? 0 : value >= frame.width ? frame.width : value,
    }
  })

  useEffect(() => {
    function play() {
      cancelAnimation(width)

      width.set((player.currentTime / player.duration) * frame.width)

      width.set(() =>
        withTiming(frame.width, {
          duration: (player.duration - player.currentTime) * 1_000,
          easing: Easing.linear,
        }),
      )
    }

    function pause() {
      cancelAnimation(width)

      width.set((player.currentTime / player.duration) * frame.width)
    }

    if (player.playing) {
      play()
    }

    const playingChange = player.addListener('playingChange', (next) => {
      setPlaying(next.isPlaying)

      if (next.isPlaying) {
        play()
      } else {
        pause()
      }
    })

    const statusChange = player.addListener('statusChange', (next) => {
      setLoading(next.status === 'loading')
    })

    return () => {
      playingChange.remove()
      statusChange.remove()
    }
  }, [frame.width, player, width])

  return (
    <Animated.View pointerEvents="box-none" style={[styles.main, style]}>
      <View
        align="center"
        direction="row"
        justify="center"
        px="2"
        style={styles.controls}
      >
        <HeaderButton
          contrast
          icon="Rewind"
          onPress={() => {
            player.seekBy(-10)

            if (!player.playing) {
              width.set(() =>
                withTiming(
                  (player.currentTime / player.duration) * frame.width,
                ),
              )
            }
          }}
          weight="duotone"
        />

        <HeaderButton
          icon={playing ? 'Pause' : 'Play'}
          loading={loading}
          onPress={() => {
            if (playing) {
              player.pause()
            } else {
              player.play()
            }
          }}
          weight="fill"
        />

        <HeaderButton
          contrast
          icon="FastForward"
          onPress={() => {
            player.seekBy(10)

            if (!player.playing) {
              width.set(() =>
                withTiming(
                  (player.currentTime / player.duration) * frame.width,
                ),
              )
            }
          }}
          weight="duotone"
        />

        <HeaderButton
          icon={muted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
          onPress={() => {
            onMutedChange(!muted)
          }}
          weight="duotone"
        />
      </View>

      <Animated.View style={styles.seek}>
        <Animated.View style={[styles.progress, progress]} />
      </Animated.View>
    </Animated.View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  controls: {
    alignSelf: 'center',
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[9],
    bottom: theme.space[9] + runtime.insets.bottom,
    position: 'absolute',
  },
  main: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  progress: {
    backgroundColor: theme.colors.accent.a5,
    height: theme.space[2] + runtime.insets.bottom,
  },
  seek: {
    backgroundColor: theme.colors.black.a5,
    flex: 1,
  },
}))
