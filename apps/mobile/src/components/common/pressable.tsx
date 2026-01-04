import { type CustomPressableProps, PressableOpacity } from 'pressto'
import { StyleSheet } from 'react-native-unistyles'

import { stripProps } from '~/lib/styles'
import { type MarginProps, type PaddingProps } from '~/styles/space'
import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = {
  disabled?: boolean
} & Omit<CustomPressableProps, 'enabled'> &
  ViewStyleProps &
  MarginProps &
  PaddingProps

export function Pressable({
  accessibilityRole = 'button',
  children,
  disabled = false,
  style,
  ...props
}: Props) {
  return (
    <PressableOpacity
      {...stripProps(props)}
      accessibilityRole={accessibilityRole}
      enabled={!disabled}
      style={[styles.main(props), style]}
    >
      {children}
    </PressableOpacity>
  )
}

const styles = StyleSheet.create({
  main: getViewStyles,
})
