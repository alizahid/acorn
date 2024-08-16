import {
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/colors'

import { Pressable } from './pressable'
import { Spinner } from './spinner'
import { Text } from './text'

type Props = {
  color?: ColorToken
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
      <Text color={color} contrast size="3" weight="medium">
        {label}
      </Text>

      {loading ? <Spinner color={color} contrast /> : null}
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
