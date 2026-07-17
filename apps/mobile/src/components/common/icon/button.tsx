import { type ReactNode } from 'react'
import { type Insets, type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type SpaceToken } from '~/styles/tokens'

import { Pressable } from '../pressable'

type Props = {
  children: ReactNode
  disabled?: boolean
  header?: boolean
  hitSlop?: number | Insets
  label: string
  onLongPress?: () => void
  onPress?: () => void
  size?: SpaceToken
  style?: StyleProp<ViewStyle>
}

export function IconButton({
  children,
  disabled,
  header,
  hitSlop,
  label,
  onLongPress,
  onPress,
  size = '8',
  style,
}: Props) {
  return (
    <Pressable
      accessibilityLabel={label}
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
