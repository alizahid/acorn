import { type Insets, type StyleProp, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { type ColorToken, type SpaceToken } from '~/styles/tokens'

import { Icon, type IconName, type IconWeight } from './icon'
import { Pressable } from './pressable'
import { Spinner } from './spinner'

type Props = {
  contrast?: boolean
  hitSlop?: number | Insets
  icon: {
    color?: ColorToken
    name: IconName
    size?: number
    weight?: IconWeight
  }
  label: string
  loading?: boolean
  onLongPress?: () => void
  onPress?: () => void
  size?: SpaceToken
  style?: StyleProp<ViewStyle>
}

export function IconButton({
  contrast,
  hitSlop,
  icon,
  label,
  loading,
  onLongPress,
  onPress,
  size = '8',
  style,
}: Props) {
  const { theme } = useStyles()

  return (
    <Pressable
      align="center"
      disabled={loading}
      height={size}
      hitSlop={hitSlop}
      justify="center"
      label={label}
      onLongPress={onLongPress}
      onPress={onPress}
      style={style}
      width={size}
    >
      {loading ? (
        <Spinner
          color={
            icon.color
              ? theme.colors[icon.color].accent
              : theme.colors.accent[contrast ? 'contrast' : 'accent']
          }
        />
      ) : (
        <Icon
          color={
            icon.color
              ? theme.colors[icon.color].accent
              : theme.colors.accent[contrast ? 'contrast' : 'accent']
          }
          name={icon.name}
          size={icon.size ?? theme.space[5]}
          weight={icon.weight}
        />
      )}
    </Pressable>
  )
}
