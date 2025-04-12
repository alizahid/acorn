import {
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/tokens'
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
  onPress?: (event: GestureResponderEvent) => void
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
  const { styles, theme } = useStyles(stylesheet)

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
      style={[styles.main(color), style]}
    >
      {icon && loading ? (
        <Spinner color={theme.colors[color].contrast} size={theme.space[5]} />
      ) : icon ? (
        <Icon
          color={theme.colors[color].contrast}
          name={icon.name}
          size={theme.space[5]}
          weight={icon.weight}
        />
      ) : null}

      <Text color={color} contrast weight="medium">
        {label}
      </Text>

      {!icon && loading ? (
        <Spinner color={color} contrast size={theme.space[5]} />
      ) : null}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (color?: ColorToken) => ({
    backgroundColor: theme.colors[color ?? 'accent'].accent,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  }),
}))
