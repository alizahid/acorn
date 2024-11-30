import { type GestureResponderEvent } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'

type Props = {
  color?: string
  compact?: boolean
  fill?: boolean
  icon: IconName
  onPress?: (event: GestureResponderEvent) => void
  weight?: IconWeight
}

export function FooterButton({
  color,
  compact,
  fill,
  icon,
  onPress,
  weight,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      height={compact ? undefined : '6'}
      hitSlop={theme.space[2]}
      justify="center"
      onPress={onPress}
      style={styles.main(color, fill)}
      width={compact ? undefined : '6'}
    >
      <Icon
        color={fill ? theme.colors.white.a12 : color}
        name={icon}
        size={compact ? theme.typography[2].fontSize : theme.space[5]}
        weight={weight}
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (color?: string, fill?: boolean) => ({
    backgroundColor: fill ? color : undefined,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  }),
}))
