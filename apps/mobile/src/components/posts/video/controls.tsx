import { type VideoPlayer } from 'expo-video'
import { useEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
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

import { HeaderButton } from '~/components/navigation/header-button'

type Props = {
  opacity: SharedValue<number>
  player: VideoPlayer
}

export function VideoControls({ opacity, player }: Props) {
  const frame = useSafeAreaFrame()

  const { styles, theme } = useStyles(stylesheet)

  const width = useSharedValue(0)

  const [playing, setPlaying] = useState(player.playing)

  const maxWidth = useMemo(
    () => frame.width - theme.space[4] - theme.space[4],
    [frame.width, theme.space],
  )

  useEffect(() => {
    function go() {
      width.set((player.currentTime / player.duration) * maxWidth)

      width.set(() =>
        withTiming(maxWidth, {
          duration: (player.duration - player.currentTime) * 1_000,
          easing: Easing.linear,
        }),
      )
    }

    function stop() {
      cancelAnimation(width)

      width.set((player.currentTime / player.duration) * maxWidth)
    }

    go()

    const playingChange = player.addListener('playingChange', (next) => {
      setPlaying(next.isPlaying)

      if (next.isPlaying) {
        go()
      } else {
        stop()
      }
    })

    const playToEnd = player.addListener('playToEnd', () => {
      go()
    })

    return () => {
      playingChange.remove()
      playToEnd.remove()
    }
  }, [maxWidth, player, width])

  const mainStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const seekStyle = useAnimatedStyle(() => ({
    width: width.get(),
  }))

  return (
    <Animated.View pointerEvents="box-none" style={[styles.main, mainStyle]}>
      <Animated.View pointerEvents="none" style={[styles.seek, seekStyle]} />

      <HeaderButton
        contrast
        icon="Rewind"
        onPress={() => {
          player.seekBy(-10)
        }}
        weight="duotone"
      />

      <HeaderButton
        contrast
        icon={playing ? 'Pause' : 'Play'}
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
        }}
        weight="duotone"
      />
    </Animated.View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    bottom: theme.space[9] + runtime.insets.bottom,
    flexDirection: 'row',
    justifyContent: 'center',
    left: theme.space[4],
    overflow: 'hidden',
    position: 'absolute',
    right: theme.space[4],
  },
  seek: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.accent.a5,
  },
}))
