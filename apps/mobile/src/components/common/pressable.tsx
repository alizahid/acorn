import { forwardRef, type ReactNode } from 'react'
import {
  type GestureResponderEvent,
  type Insets,
  type LayoutChangeEvent,
  Pressable as ReactNativePressable,
  type StyleProp,
  type View,
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
  children?: ReactNode
  disabled?: boolean
  hitSlop?: number | Insets
  onLayout?: (event: LayoutChangeEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
} & ViewStyleProps

export const Pressable = forwardRef<View, Props>(function Pressable(
  {
    children,
    disabled,
    hitSlop,
    onLayout,
    onLongPress,
    onPress,
    style,
    ...props
  },
  ref,
) {
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
      onPress={(event) => {
        onPress?.(event)

        if (event.defaultPrevented) {
          return
        }

        opacity.set(() =>
          withTiming(
            0.5,
            {
              duration: 100,
            },
            () => {
              opacity.set(() =>
                withTiming(1, {
                  duration: 200,
                }),
              )
            },
          ),
        )
      }}
      ref={ref}
      style={[main, styles.main(props), style]}
    >
      {children}
    </AnimatedPressable>
  )
})

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
