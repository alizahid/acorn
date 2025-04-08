import { type ReactNode } from 'react'
import {
  type AccessibilityRole,
  type GestureResponderEvent,
  type Insets,
  type LayoutChangeEvent,
  Pressable as ReactNativePressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = {
  children?: ReactNode
  delayed?: boolean
  disabled?: boolean
  hitSlop?: number | Insets
  label: string
  onLayout?: (event: LayoutChangeEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  onPress?: (event: GestureResponderEvent) => void
  role?: AccessibilityRole
  style?: StyleProp<ViewStyle>
} & ViewStyleProps

export function Pressable({
  children,
  delayed,
  disabled,
  hitSlop,
  label,
  onLayout,
  onLongPress,
  onPress,
  role = 'button',
  style,
  ...props
}: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <ReactNativePressable
      accessibilityLabel={label}
      accessibilityRole={role}
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.main(props) as ViewStyle,
        styles.opacity(pressed),
        style,
      ]}
      unstable_pressDelay={delayed ? 100 : 0}
    >
      {children}
    </ReactNativePressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
  opacity: (pressed: boolean) => ({
    opacity: pressed ? 0.5 : 1,
  }),
}))
