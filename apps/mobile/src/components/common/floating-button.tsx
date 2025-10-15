import { type SFSymbol } from 'expo-symbols'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { glass } from '~/lib/common'
import { mapColors } from '~/lib/styles'
import { type ColorToken, space } from '~/styles/tokens'

import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'
import { IconButton } from './icon/button'

export const FloatingButtonSide = ['left', 'center', 'right', 'hide'] as const

export type FloatingButtonSide = (typeof FloatingButtonSide)[number]

type Props = {
  color?: ColorToken
  icon: SFSymbol
  label: string
  onLongPress?: () => void
  onPress?: () => void
  side?: FloatingButtonSide
  style?: StyleProp<ViewStyle>
}

export function FloatingButton({
  color = 'accent',
  icon,
  label,
  onLongPress,
  onPress,
  side = 'right',
  style,
}: Props) {
  styles.useVariants({
    color,
    side,
  })

  const Component = glass ? GlassView : BlurView

  return (
    <Component intensity={100} isInteractive style={[styles.main, style]}>
      <IconButton
        color={color}
        hitSlop={space[4]}
        icon={icon}
        label={label}
        onLongPress={onLongPress}
        onPress={onPress}
        weight="bold"
      />
    </Component>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom: runtime.insets.bottom + 64,
    overflow: glass ? undefined : 'hidden',
    position: 'absolute',
    variants: {
      color: mapColors((token) => ({
        backgroundColor: glass ? undefined : theme.colors[token].uiActiveAlpha,
      })),
      side: {
        center: {
          left: runtime.screen.width / 2 - theme.space[8] / 2,
        },
        hide: {
          display: 'none',
        },
        left: {
          left: theme.space[4],
        },
        right: {
          right: theme.space[4],
        },
      },
    },
  },
}))
