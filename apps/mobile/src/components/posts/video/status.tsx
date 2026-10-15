import { View } from 'react-native'
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  duration: SharedValue<number>
  buffered: SharedValue<number>
  current: SharedValue<number>
}

function progress(value: number, duration: number) {
  'worklet'

  return duration > 0 ? Math.min(Math.max(value / duration, 0), 1) : 0
}

export function VideoStatus({ duration, buffered, current }: Props) {
  const currentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: progress(current.get(), duration.get()),
      },
    ],
  }))

  const bufferedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: progress(buffered.get(), duration.get()),
      },
    ],
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
    transformOrigin: 'left',
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
