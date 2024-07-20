import {
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorName } from '~/styles/colors'

import { Pressable } from './pressable'
import { Spinner } from './spinner'
import { Text } from './text'

type Props = {
  color?: ColorName
  disabled?: boolean
  label: string
  loading?: boolean
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

export function Button({
  color = 'accent',
  disabled,
  label,
  loading,
  onPress,
  style,
}: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <Pressable
      disabled={disabled ?? loading}
      onPress={onPress}
      style={[styles.main(color), style]}
    >
      <Text color={color} contrast size="3" weight="medium">
        {label}
      </Text>

      {loading ? <Spinner color={color} contrast /> : null}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (color?: ColorName) => ({
    alignItems: 'center',
    backgroundColor: theme.colors[`${color ?? 'accent'}A`][9],
    borderRadius: theme.radius[4],
    flexDirection: 'row',
    gap: theme.space[2],
    height: theme.space[7],
    justifyContent: 'center',
    paddingHorizontal: theme.space[4],
  }),
}))
