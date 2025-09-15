import { type ReactNode } from 'react'
import {
  type AccessibilityRole,
  type AccessibilityState,
  Pressable as Component,
  type Insets,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = {
  children?: ReactNode
  disabled?: boolean
  hint?: string
  hitSlop?: number | Insets
  label: string
  onLayout?: (event: LayoutChangeEvent) => void
  onLongPress?: () => void
  onPress?: () => void
  role?: AccessibilityRole
  state?: AccessibilityState
  style?: StyleProp<ViewStyle>
} & ViewStyleProps

export function Pressable({
  children,
  disabled,
  hint,
  hitSlop,
  label,
  onLayout,
  onLongPress,
  onPress,
  role = 'button',
  state,
  style,
  ...props
}: Props) {
  return (
    <Component
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole={role}
      accessibilityState={state}
      delayLongPress={200}
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onLongPress={onLongPress ?? (() => null)}
      onPress={onPress}
      style={[styles.main(props) as ViewStyle, style]}
    >
      {children}
    </Component>
  )
}

const styles = StyleSheet.create({
  main: getViewStyles,
})
