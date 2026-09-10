import { type ReactNode } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { glass } from '~/lib/common'
import { mapColors } from '~/lib/styles'
import { type ColorToken } from '~/styles/tokens'

import { GlassView } from '../native/glass-view'
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

  const Component = glass ? GlassView : View

  return (
    <Component
      isInteractive={!disabled}
      style={[styles.main, style]}
      uniProps={(theme) => ({
        tintColor: theme.colors[color].accent,
      })}
    >
      <Pressable
        accessibilityLabel={label}
        disabled={disabled || loading}
        onPress={onPress}
        style={styles.content}
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
    </Component>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    height: theme.space[7],
    justifyContent: 'center',
    paddingHorizontal: theme.space[4],
  },
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    variants: {
      color: mapColors((token) => ({
        backgroundColor: glass ? undefined : theme.colors[token].accent,
      })),
    },
  },
}))
