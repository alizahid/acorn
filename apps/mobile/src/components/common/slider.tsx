import { range } from 'lodash'
import { useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { View } from './view'

type Props = {
  disabled?: boolean
  max?: number
  min?: number
  onChange: (value: number) => void
  step?: number
  style?: StyleProp<ViewStyle>
  value: number
}

export function Slider({
  disabled,
  max = 10,
  min = 0,
  onChange,
  step = 10,
  style,
  value,
}: Props) {
  const width = useSharedValue(0)

  const [size, setSize] = useState(0)

  const steps = range(min, max + step, step)

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      const next = closest(steps, event.x / size)

      if (next !== undefined) {
        width.set(percent(next, min, max))

        onChange(next)
      }
    })

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((event) => {
      const next = closest(steps, event.x / size)

      if (next !== undefined) {
        width.set(percent(next, min, max))
      }
    })
    .onEnd((event) => {
      const next = closest(steps, event.x / size)

      if (next !== undefined) {
        width.set(percent(next, min, max))

        onChange(next)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.get()}%`,
  }))

  return (
    <GestureDetector gesture={Gesture.Exclusive(tap, pan)}>
      <View
        onLayout={(event) => {
          width.set(percent(value, min, max))

          setSize(event.nativeEvent.layout.width)
        }}
        style={[styles.main, style]}
      >
        <Animated.View style={[styles.track, animatedStyle]} />

        {!disabled && step && min && max ? (
          <View
            align="center"
            direction="row"
            justify="between"
            pointerEvents="none"
            style={styles.markers}
          >
            {steps.map((item, index) => (
              <View
                key={item}
                style={styles.marker(index === 0 || index === steps.length - 1)}
              />
            ))}
          </View>
        ) : null}
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[2],
    height: theme.space[6],
    overflow: 'hidden',
  },
  marker: (hidden: boolean) => ({
    backgroundColor: hidden ? 'transparent' : theme.colors.gray.borderAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    height: theme.space[3],
    width: 1,
  }),
  markers: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
  track: {
    backgroundColor: theme.colors.accent.accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[1],
    height: theme.space[6],
  },
}))

function percent(value: number, min: number, max: number) {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
}

function closest(data: Array<number>, input: number) {
  return data[Math.round(input * (data.length - 1))]
}
