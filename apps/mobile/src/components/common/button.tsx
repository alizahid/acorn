import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { mapColors } from '~/lib/styles'
import { type ColorToken } from '~/styles/tokens'

import { Pressable } from './pressable'
import { Spinner } from './spinner'
import { Text } from './text'

type Props = {
  color?: ColorToken
  disabled?: boolean
  label: string
  left?: ReactNode
  loading?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export function Button({
  color = 'accent',
  disabled = false,
  label,
  left,
  loading = false,
  onPress,
  style,
}: Props) {
  styles.useVariants({
    color,
  })

  return (
    <Pressable
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.main, style]}
    >
      {left}

      <Text color={color} contrast weight="medium">
        {label}
      </Text>

      {loading ? (
        <Spinner
          color={color}
          contrast
          uniProps={(theme) => ({
            size: theme.space[5],
          })}
        />
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    flexDirection: 'row',
    gap: theme.space[2],
    height: theme.space[7],
    justifyContent: 'center',
    paddingHorizontal: theme.space[4],
    variants: {
      color: mapColors((token) => ({
        backgroundColor: theme.colors[token].accent,
      })),
    },
  },
}))
