import {
  type CustomPressableProps,
  PressableOpacity,
  PressableWithoutFeedback,
} from 'pressto'
import { StyleSheet } from 'react-native-unistyles'

import { stripProps } from '~/lib/styles'
import { type MarginProps, type PaddingProps } from '~/styles/space'
import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = {
  disabled?: boolean
  variant?: 'opacity' | 'plain'
} & Omit<CustomPressableProps, 'enabled'> &
  ViewStyleProps &
  MarginProps &
  PaddingProps

export function Pressable({
  accessibilityRole = 'button',
  children,
  disabled = false,
  style,
  variant = 'opacity',
  ...props
}: Props) {
  const Main = variant === 'plain' ? PressableWithoutFeedback : PressableOpacity

  return (
    <Main
      {...stripProps(props)}
      accessibilityRole={accessibilityRole}
      enabled={!disabled}
      style={[styles.main(props), style]}
    >
      {children}
    </Main>
  )
}

const styles = StyleSheet.create({
  main: getViewStyles,
})
