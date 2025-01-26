import { forwardRef, type ReactNode, useCallback } from 'react'
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

export const Pressable = forwardRef<View, Props>(function Component(
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

  const animate = useCallback(() => {
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
  }, [opacity])

  return (
    <AnimatedPressable
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onLongPress={(event) => {
        if (onLongPress) {
          onLongPress(event)

          animate()
        }
      }}
      onPress={(event) => {
        if (onPress) {
          onPress(event)

          animate()
        }
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
