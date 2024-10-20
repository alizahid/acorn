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

const Component = Animated.createAnimatedComponent(ReactNativePressable)

type Props = {
  children?: ReactNode
  disabled?: boolean
  hitSlop?: number | Insets
  onLayout?: (event: LayoutChangeEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
} & ViewStyleProps

export function Pressable({
  children,
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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  return (
    <Component
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onLongPress={onLongPress}
      onPress={(event) => {
        onPress?.(event)

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
      style={[animatedStyle, styles.main(props), style]}
    >
      {children}
    </Component>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
