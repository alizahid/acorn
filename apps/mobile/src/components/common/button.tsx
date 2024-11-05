import {
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/colors'

import { Icon, type IconName, type IconWeight } from './icon'
import { Pressable } from './pressable'
import { Spinner } from './spinner'
import { Text } from './text'

type Props = {
  color?: ColorToken
  disabled?: boolean
  icon?: {
    color?: ColorToken
    name: IconName
    weight?: IconWeight
  }
  label: string
  loading?: boolean
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

export function Button({
  color = 'accent',
  disabled,
  icon,
  label,
  loading,
  onPress,
  style,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      disabled={disabled ?? loading}
      gap="2"
      height="7"
      justify="center"
      onPress={onPress}
      px="4"
      style={[styles.main(color), style]}
    >
      {icon && loading ? (
        <Spinner
          color={icon.color ? theme.colors[icon.color ?? 'accent'].a9 : color}
          contrast={!icon.color}
          size={theme.space[5]}
        />
      ) : icon ? (
        <Icon
          color={theme.colors[icon.color ?? 'accent'].a9}
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
    backgroundColor: theme.colors[color ?? 'accent'].a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  }),
}))
