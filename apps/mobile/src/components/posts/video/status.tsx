import { View } from 'react-native'
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  buffered: SharedValue<number>
  current: SharedValue<number>
  duration: SharedValue<number>
  interval?: number
}

export function VideoStatus({
  buffered,
  current,
  duration,
  interval = 500,
}: Props) {
  const config = {
    duration: interval,
    easing: Easing.linear,
  } as const

  const currentStyle = useAnimatedStyle(() => ({
    width: withTiming(
      `${(current.get() / duration.get()) * 100 || 0}%`,
      config,
    ),
  }))

  const bufferedStyle = useAnimatedStyle(() => ({
    width: withTiming(
      `${(buffered.get() / duration.get()) * 100 || 0}%`,
      config,
    ),
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
