import { useEventListener } from 'expo'
import { type VideoPlayer } from 'expo-video'
import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  player: VideoPlayer
}

export function VideoStatus({ player }: Props) {
  const current = useSharedValue(0)
  const buffered = useSharedValue(0)

  useEventListener(player, 'timeUpdate', (event) => {
    const nextCurrent = (event.currentTime / player.duration) * 100

    if (current.get() !== nextCurrent) {
      cancelAnimation(current)

      current.set(() =>
        withTiming((event.currentTime / player.duration) * 100, {
          duration: 1000 / 60,
        }),
      )
    }

    const nextBuffered = (event.bufferedPosition / player.duration) * 100

    if (buffered.get() !== nextBuffered) {
      cancelAnimation(buffered)

      buffered.set(() =>
        withTiming(nextBuffered, {
          duration: 1000 / 60,
        }),
      )
    }
  })

  const currentStyle = useAnimatedStyle(() => ({
    width: `${current.get()}%`,
  }))

  const bufferedStyle = useAnimatedStyle(() => ({
    width: `${buffered.get()}%`,
  }))

  return (
    <View style={styles.main}>
      <Animated.View style={[styles.bar, styles.buffered, bufferedStyle]} />

      <Animated.View style={[styles.bar, styles.current, currentStyle]} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  bar: {
    borderCurve: 'continuous',
    borderRadius: theme.space[1],
    bottom: 0,
    height: theme.space[1],
    left: 0,
    position: 'absolute',
    right: 0,
  },
  buffered: {
    backgroundColor: theme.colors.accent.uiAlpha,
  },
  current: {
    backgroundColor: theme.colors.accent.accent,
  },
  main: {
    backgroundColor: theme.colors.gray.uiAlpha,
    bottom: 0,
    left: -theme.space[1],
    position: 'absolute',
    right: -theme.space[1],
  },
}))
