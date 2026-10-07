import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-screens/experimental'
import { StyleSheet } from 'react-native-unistyles'

import { glass } from '~/lib/common'
import { space } from '~/styles/tokens'

import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'
import { IconButton } from './icon/button'

export const FloatingButtonSize = 80 // 48 + 16 + 16

export const FloatingButtonSide = ['left', 'center', 'right', 'hide'] as const

export type FloatingButtonSide = (typeof FloatingButtonSide)[number]

type Props = {
  children: ReactNode
  disabled?: boolean
  label: string
  onLongPress?: () => void
  onPress?: () => void
  side?: FloatingButtonSide
  style?: StyleProp<ViewStyle>
}

export function FloatingButton({
  children,
  disabled,
  label,
  onLongPress,
  onPress,
  side = 'right',
  style,
}: Props) {
  styles.useVariants({
    glass,
    side,
  })

  const Component = glass ? GlassView : BlurView

  return (
    <SafeAreaView
      edges={{
        bottom: true,
      }}
      style={[styles.main, style]}
    >
      <Component intensity={100} isInteractive style={styles.button}>
        <IconButton
          accessibilityLabel={label}
          disabled={disabled}
          hitSlop={space[4]}
          onLongPress={onLongPress}
          onPress={onPress}
        >
          {children}
        </IconButton>
      </Component>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  button: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    variants: {
      glass: {
        false: {
          overflow: 'hidden',
        },
      },
    },
  },
  main: {
    bottom: theme.space[4],
    position: 'absolute',
    variants: {
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
