import { type SFSymbol } from 'expo-symbols'
import { type Insets, type StyleProp, type ViewStyle } from 'react-native'

import { type ColorToken, type SpaceToken } from '~/styles/tokens'

import { Pressable } from '../pressable'
import { Spinner } from '../spinner'
import { Icon } from '.'

type Props = {
  color?: ColorToken
  contrast?: boolean
  hitSlop?: number | Insets
  icon: SFSymbol
  label: string
  loading?: boolean
  onLongPress?: () => void
  onPress?: () => void
  size?: SpaceToken
  style?: StyleProp<ViewStyle>
}

export function IconButton({
  color = 'accent',
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
          uniProps={(theme) => ({
            color: theme.colors[color][contrast ? 'contrast' : 'accent'],
            size: theme.space[5],
          })}
        />
      ) : (
        <Icon
          name={icon}
          uniProps={(theme) => ({
            size: theme.space[5],
            tintColor: theme.colors[color][contrast ? 'contrast' : 'accent'],
          })}
        />
      )}
    </Pressable>
  )
}
