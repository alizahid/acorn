import { type ReactNode, useState } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

type Props = {
  children: ReactNode
  left?: ReactNode
  right?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function Swipeable({ children, left, right, style }: Props) {
  const offset = useSharedValue(0)
  const translate = useSharedValue(0)

  const start = useSharedValue(0)
  const end = useSharedValue(0)

  const [enabled, setEnabled] = useState(false)

  useAnimatedReaction(
    () => translate.get(),
    (prepared) => {
      scheduleOnRN(setEnabled, prepared !== 0)
    },
  )

  const pan = Gesture.Pan()
    .onStart(() => {
      offset.set(translate.get())
    })
    .onUpdate((event) => {
      const x = Math.min(
        Math.max(offset.get() + event.translationX, -end.get()),
        start.get(),
      )

      translate.set(x)
    })
    .onEnd(() => {
      const x = translate.get()

      if (x > 0) {
        translate.set(
          withTiming(x > start.get() / 2 ? start.get() : 0, {
            duration: 100,
          }),
        )
      } else {
        translate.set(
          withTiming(Math.abs(x) > end.get() / 2 ? -end.get() : 0, {
            duration: 100,
          }),
        )
      }
    })

  const tap = Gesture.Tap()
    .enabled(enabled)
    .onEnd(() => {
      translate.set(
        withTiming(0, {
          duration: 100,
        }),
      )
    })

  const leading = useAnimatedStyle(() => ({
    left: 0,
    opacity: interpolate(translate.get(), [0, start.get()], [0, 1]),
    position: 'absolute',
    transform: [
      {
        translateX: translate.get() - start.get(),
      },
    ],
  }))

  const main = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translate.get(),
      },
    ],
  }))

  const trailing = useAnimatedStyle(() => ({
    opacity: interpolate(translate.get(), [0, -end.get()], [0, 1]),
    position: 'absolute',
    right: 0,
    transform: [
      {
        translateX: translate.get() + end.get(),
      },
    ],
  }))

  return (
    <GestureDetector gesture={pan}>
      <View style={style}>
        {left ? (
          <Animated.View
            onLayout={(event) => {
              start.set(event.nativeEvent.layout.width)
            }}
            style={leading}
          >
            {left}
          </Animated.View>
        ) : null}

        <GestureDetector gesture={tap}>
          <Animated.View style={main}>{children}</Animated.View>
        </GestureDetector>

        {right ? (
          <Animated.View
            onLayout={(event) => {
              end.set(event.nativeEvent.layout.width)
            }}
            style={trailing}
          >
            {right}
          </Animated.View>
        ) : null}
      </View>
    </GestureDetector>
  )
}
