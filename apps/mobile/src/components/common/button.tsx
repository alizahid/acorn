import { type SFSymbol } from 'expo-symbols'
import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { mapColors } from '~/lib/styles'
import { type ColorToken } from '~/styles/tokens'
import { type ViewStyleProps } from '~/styles/view'

import { Icon } from './icon'
import { Pressable } from './pressable'
import { Spinner } from './spinner'
import { Text } from './text'

type Props = {
  color?: ColorToken
  disabled?: boolean
  icon?: SFSymbol
  justify?: ViewStyleProps['justify']
  label: string
  left?: ReactNode
  loading?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export function Button({
  color = 'accent',
  disabled = false,
  icon,
  justify = 'center',
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
      align="center"
      direction="row"
      disabled={disabled || loading}
      gap="2"
      height="7"
      justify={justify}
      onPress={onPress}
      px="4"
      style={[styles.main, style]}
    >
      {left}

      {icon && loading ? (
        <Spinner
          uniProps={(theme) => ({
            color: theme.colors[color].contrast,
            size: theme.space[5],
          })}
        />
      ) : icon ? (
        <Icon
          name={icon}
          uniProps={(theme) => ({
            tintColor: theme.colors[color].contrast,
          })}
        />
      ) : null}

      <Text color={color} contrast weight="medium">
        {label}
      </Text>

      {!icon && loading ? (
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
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    variants: {
      color: mapColors((token) => ({
        backgroundColor: theme.colors[token].accent,
      })),
    },
  },
}))
