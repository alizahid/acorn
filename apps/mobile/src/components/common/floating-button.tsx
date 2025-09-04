import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type ColorToken, ColorTokens, space } from '~/styles/tokens'

import { BlurView } from '../native/blur-view'
import { type IconName } from './icon'
import { IconButton } from './icon/button'

export const FloatingButtonSide = ['left', 'center', 'right', 'hide'] as const

export type FloatingButtonSide = (typeof FloatingButtonSide)[number]

type Props = {
  color?: ColorToken
  icon: IconName
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

  return (
    <BlurView
      intensity={100}
      style={[styles.main, style]}
      uniProps={(theme) => ({
        tint: theme.variant,
      })}
    >
      <IconButton
        hitSlop={space[4]}
        icon={{
          color,
          name: icon,
          weight: 'bold',
        }}
        label={label}
        onLongPress={onLongPress}
        onPress={onPress}
      />
    </BlurView>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom: runtime.insets.bottom + 64,
    overflow: 'hidden',
    position: 'absolute',
    variants: {
      color: Object.fromEntries(
        ColorTokens.map((token) => [
          token,
          {
            backgroundColor: theme.colors[token].uiActiveAlpha,
          },
        ]),
      ),
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
