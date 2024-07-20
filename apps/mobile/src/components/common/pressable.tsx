import { type ReactNode } from 'react'
import {
  type GestureResponderEvent,
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
  onLongPress?: (event: GestureResponderEvent) => void
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

export function Pressable({
  children,
  disabled,
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
    >
      {children}
    </Component>
  )
}
