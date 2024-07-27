import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/colors'

import { Icon, type IconName } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'

type Props = {
  color?: ColorToken
  contrast?: boolean
  icon: IconName
  loading?: boolean
  onPress?: () => void
}

export function HeaderButton({
  color = 'accent',
  contrast,
  icon,
  loading,
  onPress,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable disabled={loading} onPress={onPress} style={styles.main}>
      {loading ? (
        <Spinner color={color} contrast={contrast} />
      ) : (
        <Icon
          color={theme.colors[color][contrast ? 'contrast' : 11]}
          name={icon}
          size={theme.space[5]}
          weight="bold"
        />
      )}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
    width: theme.space[8],
  },
}))
