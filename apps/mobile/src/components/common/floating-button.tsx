import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useBottomTabBarHeight } from 'react-native-bottom-tabs'
import { StyleSheet } from 'react-native-unistyles'

import { glass, iPad } from '~/lib/common'
import { space } from '~/styles/tokens'

import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'
import { IconButton } from './icon/button'

export const FloatingButtonSide = ['left', 'center', 'right', 'hide'] as const

export type FloatingButtonSide = (typeof FloatingButtonSide)[number]

type Props = {
  children: ReactNode
  label: string
  onLongPress?: () => void
  onPress?: () => void
  side?: FloatingButtonSide
  style?: StyleProp<ViewStyle>
}

export function FloatingButton({
  children,
  label,
  onLongPress,
  onPress,
  side = 'right',
  style,
}: Props) {
  const tabBarHeight = useBottomTabBarHeight()

  styles.useVariants({
    glass,
    iPad,
    side,
  })

  const Component = glass ? GlassView : BlurView

  return (
    <Component
      intensity={100}
      isInteractive
      style={[styles.main(tabBarHeight), style]}
    >
      <IconButton
        hitSlop={space[4]}
        label={label}
        onLongPress={onLongPress}
        onPress={onPress}
      >
        {children}
      </IconButton>
    </Component>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  main: (tabBarHeight: number) => ({
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    position: 'absolute',
    variants: {
      glass: {
        false: {
          overflow: 'hidden',
        },
      },
      iPad: {
        false: {
          bottom: tabBarHeight + theme.space[4],
        },
        true: {
          bottom: runtime.insets.bottom + theme.space[4],
        },
      },
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
  }),
}))
