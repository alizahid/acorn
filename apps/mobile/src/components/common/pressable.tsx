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

export const PRESS_DELAY = 130

const Component = Animated.createAnimatedComponent(ReactNativePressable)

type Props = {
  children?: ReactNode
  disabled?: boolean
  hitSlop?: number | Insets
  onLayout?: (event: LayoutChangeEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  without?: boolean
} & ViewStyleProps

export function Pressable({
  children,
  disabled,
  hitSlop,
  onLayout,
  onLongPress,
  onPress,
  style,
  without,
  ...props
}: Props) {
  const { styles } = useStyles(stylesheet)

  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Component
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={() => {
        if (without) {
          return
        }

        opacity.value = withTiming(0.5, {
          duration: 100,
        })
      }}
      onPressOut={() => {
        if (without) {
          return
        }

        opacity.value = withTiming(1, {
          duration: 100,
        })
      }}
      style={[animatedStyle, styles.main(props), style]}
      unstable_pressDelay={PRESS_DELAY}
    >
      {children}
    </Component>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
