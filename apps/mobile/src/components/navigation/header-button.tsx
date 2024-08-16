import { type StyleProp, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'

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
  const { theme } = useStyles()

  return (
    <Pressable
      align="center"
      disabled={loading}
      height="8"
      justify="center"
      onPress={onPress}
      style={style}
      width="8"
    >
      {loading ? (
        <Spinner color={color} contrast={contrast} />
      ) : (
        <Icon
          color={theme.colors[color][contrast ? 'contrast' : 9]}
          name={icon}
          size={size ?? theme.space[5]}
          weight={weight}
        />
      )}
    </Pressable>
  )
}
