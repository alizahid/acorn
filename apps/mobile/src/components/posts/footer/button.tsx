import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'

type Props = {
  color?: string
  compact?: boolean
  fill?: boolean
  icon: IconName
  label: string
  onPress?: () => void
  weight?: IconWeight
}

export function FooterButton({
  color,
  compact,
  fill,
  icon,
  label,
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
      label={label}
      onPress={onPress}
      style={styles.main(color, fill)}
      width={compact ? undefined : '6'}
    >
      <Icon
        color={fill ? theme.colors.white.textAlpha : color}
        name={icon}
        size={compact ? theme.typography[1].fontSize : theme.space[5]}
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
