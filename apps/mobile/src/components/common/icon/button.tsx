import { type SFSymbol, type SymbolWeight } from 'expo-symbols'
import { type Insets, type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type ColorToken, type SpaceToken } from '~/styles/tokens'

import { Pressable } from '../pressable'
import { Spinner } from '../spinner'
import { Icon } from '.'

type Props = {
  color?: ColorToken
  contrast?: boolean
  disabled?: boolean
  hitSlop?: number | Insets
  icon: SFSymbol
  label: string
  loading?: boolean
  onLongPress?: () => void
  onPress?: () => void
  size?: SpaceToken
  style?: StyleProp<ViewStyle>
  weight?: SymbolWeight
}

export function IconButton({
  color = 'accent',
  contrast,
  disabled,
  hitSlop,
  icon,
  label,
  weight,
  loading,
  onLongPress,
  onPress,
  size = '8',
  style,
}: Props) {
  return (
    <Pressable
      accessibilityLabel={label}
      disabled={disabled || loading}
      hitSlop={hitSlop}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[styles.main(size), style]}
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
          weight={weight}
        />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (size: SpaceToken) => ({
    alignItems: 'center',
    height: theme.space[size],
    justifyContent: 'center',
    width: theme.space[size],
  }),
}))
