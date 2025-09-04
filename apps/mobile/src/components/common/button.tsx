import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type ColorToken, ColorTokens } from '~/styles/tokens'
import { type ViewStyleProps } from '~/styles/view'

import { Icon, type IconName, type IconWeight } from './icon'
import { Pressable } from './pressable'
import { Spinner } from './spinner'
import { Text } from './text'

type Props = {
  color?: ColorToken
  disabled?: boolean
  icon?: {
    name: IconName
    weight?: IconWeight
  }
  justify?: ViewStyleProps['justify']
  label: string
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
  loading = false,
  onPress,
  style,
}: Props) {
  styles.useVariants({
    color,
  })

  return (
    <Pressable
      align="center"
      direction="row"
      disabled={disabled || loading}
      gap="2"
      height="7"
      justify={justify}
      label={label}
      onPress={onPress}
      px="4"
      style={[styles.main, style]}
    >
      {icon && loading ? (
        <Spinner
          uniProps={(theme) => ({
            color: theme.colors[color].contrast,
            size: theme.space[5],
          })}
        />
      ) : icon ? (
        <Icon
          name={icon.name}
          uniProps={(theme) => ({
            color: theme.colors[color].contrast,
          })}
          weight={icon.weight}
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
      color: Object.fromEntries(
        ColorTokens.map((token) => [
          token,
          {
            backgroundColor: theme.colors[token].accent,
          },
        ]),
      ),
    },
  },
}))
