import {
  Pressable as Component,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { stripProps } from '~/lib/styles'
import { type MarginProps, type PaddingProps } from '~/styles/space'
import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = {
  style?: StyleProp<ViewStyle>
} & Omit<PressableProps, 'style'> &
  ViewStyleProps &
  MarginProps &
  PaddingProps

export function Pressable({
  accessibilityRole = 'button',
  children,
  style,
  ...props
}: Props) {
  return (
    <Component
      {...stripProps(props)}
      accessibilityRole={accessibilityRole}
      style={[styles.main(props), style]}
    >
      {children}
    </Component>
  )
}

const styles = StyleSheet.create({
  main: getViewStyles,
})
