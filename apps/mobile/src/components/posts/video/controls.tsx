import { type VideoPlayer } from 'expo-video'
import { useEffect, useMemo, useState } from 'react'
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

  const { styles, theme } = useStyles(stylesheet)

  const width = useSharedValue(0)

  const [playing, setPlaying] = useState(player.playing)

  const maxWidth = useMemo(
    () =>
      frame.width -
      theme.space[4] -
      theme.space[8] -
      theme.space[8] -
      theme.space[4],
    [frame.width, theme.space],
  )

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const progress = useAnimatedStyle(() => ({
    width: width.get(),
  }))

  useEffect(() => {
    function play() {
      width.set((player.currentTime / player.duration) * maxWidth)

      width.set(() =>
        withTiming(maxWidth, {
          duration: (player.duration - player.currentTime) * 1_000,
          easing: Easing.linear,
        }),
      )
    }

    function pause() {
      cancelAnimation(width)

      width.set((player.currentTime / player.duration) * maxWidth)
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

    const playToEnd = player.addListener('playToEnd', () => {
      play()
    })

    return () => {
      playingChange.remove()
      playToEnd.remove()
    }
  }, [maxWidth, player, width])

  return (
    <Animated.View pointerEvents="box-none" style={[styles.main, style]}>
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

      <Animated.View style={styles.seek}>
        <Animated.View style={[styles.progress, progress]} />
      </Animated.View>

      <HeaderButton
        contrast
        icon={muted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
        onPress={() => {
          onMutedChange(!muted)
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
  progress: {
    backgroundColor: theme.colors.accent.a5,
    height: theme.space[8],
  },
  seek: {
    backgroundColor: theme.colors.black.a3,
    flex: 1,
  },
}))
