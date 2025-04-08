import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/tokens'

import { Icon, type IconName, type IconWeight } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { Spinner } from '../../common/spinner'
import { Text } from '../../common/text'

type Props = {
  color: ColorToken
  icon: IconName
  label: string
  loading?: boolean
  onPress: () => void
  weight?: IconWeight
}

export function Button({
  color,
  icon,
  label,
  loading,
  onPress,
  weight,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      flex={1}
      gap="2"
      height="7"
      label={label}
      onPress={onPress}
      px="3"
      style={styles.main}
    >
      {loading ? (
        <Spinner color={theme.colors[color].accent} size={theme.space[5]} />
      ) : (
        <Icon
          color={theme.colors[color].accent}
          name={icon}
          size={theme.space[5]}
          weight={weight}
        />
      )}

      <Text>{label}</Text>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.accent.bgAlt,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
}))
