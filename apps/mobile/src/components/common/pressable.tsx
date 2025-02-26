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
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={() => {
        if (!animated) {
          return
        }

        opacity.set(() =>
          withTiming(0.5, {
            duration: 50,
          }),
        )
      }}
      onPressOut={() => {
        if (!animated) {
          return
        }

        opacity.set(() =>
          withTiming(1, {
            duration: 100,
          }),
        )
      }}
      style={[main, styles.main(props), style]}
      unstable_pressDelay={delayed ? 100 : undefined}
    >
      {children}
    </AnimatedPressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
