import { type ReactNode } from 'react'
import {
  type GestureResponderEvent,
  type Insets,
  type LayoutChangeEvent,
  Pressable as ReactNativePressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

const AnimatedPressable = Animated.createAnimatedComponent(ReactNativePressable)

type Props = {
  animated?: boolean
  children?: ReactNode
  delayed?: boolean
  disabled?: boolean
  hitSlop?: number | Insets
  onLayout?: (event: LayoutChangeEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
} & ViewStyleProps

export function Pressable({
  animated = true,
  children,
  delayed,
  disabled,
  hitSlop,
  onLayout,
  onLongPress,
  onPress,
  style,
  ...props
}: Props) {
  const { styles } = useStyles(stylesheet)

  const opacity = useSharedValue(1)

  const main = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  return (
    <AnimatedPressable
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onLongPress={(event) => {
        onLongPress?.(event)

        if (animated && delayed && onLongPress) {
          animate(opacity)
        }
      }}
      onPress={(event) => {
        onPress?.(event)

        if (animated && delayed && onPress) {
          animate(opacity)
        }
      }}
      onPressIn={() => {
        if (!animated || delayed) {
          return
        }

        opacity.set(() =>
          withTiming(0.5, {
            duration: 50,
          }),
        )
      }}
      onPressOut={() => {
        if (!animated || delayed) {
          return
        }

        opacity.set(() =>
          withTiming(1, {
            duration: 100,
          }),
        )
      }}
      style={[main, styles.main(props), style]}
    >
      {children}
    </AnimatedPressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))

function animate(value: SharedValue<number>) {
  function out() {
    value.set(() =>
      withTiming(1, {
        duration: 100,
      }),
    )
  }

  value.set(() =>
    withTiming(
      0.5,
      {
        duration: 50,
      },
      () => {
        runOnJS(out)()
      },
    ),
  )
}
