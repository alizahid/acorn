import { useEventListener } from 'expo'
import { type VideoPlayer } from 'expo-video'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { View } from '~/components/common/view'

type Props = {
  player: VideoPlayer
}

export function VideoStatus({ player }: Props) {
  const current = useSharedValue(0)
  const buffered = useSharedValue(0)

  const { theme } = useUnistyles()

  useEventListener(player, 'timeUpdate', (event) => {
    current.set(() =>
      withTiming((event.currentTime / player.duration) * 100 || 0, {
        duration: 1000 / 1000 / 60,
      }),
    )

    buffered.set(() =>
      withTiming((event.bufferedPosition / player.duration) * 100 || 0, {
        duration: 1000 / 1000 / 60,
      }),
    )
  })

  const currentStyle = useAnimatedStyle(() => ({
    backgroundColor: theme.colors.accent.accent,
    width: `${current.get()}%`,
  }))

  const bufferedStyle = useAnimatedStyle(() => ({
    backgroundColor: theme.colors.accent.uiAlpha,
    width: `${buffered.get()}%`,
  }))

  return (
    <View style={styles.main}>
      <Animated.View style={[styles.bar, bufferedStyle]} />

      <Animated.View style={[styles.bar, currentStyle]} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  bar: {
    bottom: 0,
    height: theme.space[1],
    left: 0,
    position: 'absolute',
    right: 0,
  },
  main: {
    backgroundColor: theme.colors.gray.uiAlpha,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
}))
