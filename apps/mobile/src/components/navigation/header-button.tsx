import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/colors'

import { Icon, type IconName, type IconWeight } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'

type Props = {
  color?: ColorToken
  contrast?: boolean
  icon: IconName
  loading?: boolean
  onPress?: () => void
  size?: number
  style?: StyleProp<ViewStyle>
  weight?: IconWeight
}

export function HeaderButton({
  color = 'accent',
  contrast,
  icon,
  loading,
  onPress,
  size,
  style,
  weight,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={[styles.main, style]}
    >
      {loading ? (
        <Spinner color={color} contrast={contrast} />
      ) : (
        <Icon
          color={theme.colors[color][contrast ? 'contrast' : 11]}
          name={icon}
          size={size ?? theme.space[5]}
          weight={weight}
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
