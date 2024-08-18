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
  withSpring,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

const Component = Animated.createAnimatedComponent(ReactNativePressable)

type Props = {
  children?: ReactNode
  delay?: boolean
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
  delay,
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

        opacity.value = withSpring(0.5, {
          duration: 100,
        })
      }}
      onPressOut={() => {
        if (without) {
          return
        }

        opacity.value = withSpring(1, {
          duration: 200,
        })
      }}
      style={[animatedStyle, styles.main(props), style]}
      unstable_pressDelay={delay ? 130 : undefined}
    >
      {children}
    </Component>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
