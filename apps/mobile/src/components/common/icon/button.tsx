import { type ReactNode } from 'react'
import { type Insets, type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type SpaceToken } from '~/styles/tokens'

import { Pressable } from '../pressable'

type Props = {
  accessibilityLabel: string
  children: ReactNode
  disabled?: boolean
  header?: boolean
  hitSlop?: number | Insets
  onLongPress?: () => void
  onPress?: () => void
  size?: SpaceToken
  style?: StyleProp<ViewStyle>
}

export function IconButton({
  accessibilityLabel,
  children,
  disabled,
  header,
  hitSlop,
  onLongPress,
  onPress,
  size = '8',
  style,
}: Props) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={header ? 16 : hitSlop}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[styles.main(header ? '5' : size), style]}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (size: SpaceToken) => ({
    alignItems: 'center',
    height: theme.space[size],
    justifyContent: 'center',
    width: theme.space[size],
  }),
}))
