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

const Component = Animated.createAnimatedComponent(ReactNativePressable)

type Props = {
  children: ReactNode
  disabled?: boolean
  hitSlop?: number | Insets
  onLayout?: (event: LayoutChangeEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

export function Pressable({
  children,
  disabled,
  hitSlop,
  onLayout,
  onLongPress,
  onPress,
  style,
}: Props) {
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
        opacity.value = withTiming(0.5, {
          duration: 100,
        })
      }}
      onPressOut={() => {
        opacity.value = withTiming(1, {
          duration: 100,
        })
      }}
      style={[animatedStyle, style]}
      unstable_pressDelay={100}
    >
      {children}
    </Component>
  )
}
