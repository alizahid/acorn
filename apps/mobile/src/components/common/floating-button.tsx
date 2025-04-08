import { BlurView } from 'expo-blur'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/tokens'

import { type IconName } from './icon'
import { IconButton } from './icon-button'

export const FloatingButtonSide = ['left', 'center', 'right', null] as const

export type FloatingButtonSide = (typeof FloatingButtonSide)[number]

type Props = {
  color?: ColorToken
  icon: IconName
  label: string
  onLongPress?: () => void
  onPress?: () => void
  side?: NonNullable<FloatingButtonSide>
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
  const { styles, theme } = useStyles(stylesheet)

  return (
    <BlurView
      intensity={100}
      style={[styles.main(color, side), style]}
      tint={theme.name}
    >
      <IconButton
        hitSlop={theme.space[4]}
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

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: (color: ColorToken, side: FloatingButtonSide) => ({
    backgroundColor: theme.colors[color].uiActiveAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom: runtime.insets.bottom + 64,
    left:
      side === 'center'
        ? runtime.screen.width / 2 - theme.space[8] / 2
        : side === 'left'
          ? theme.space[4]
          : undefined,
    overflow: 'hidden',
    position: 'absolute',
    right: side === 'right' ? theme.space[4] : undefined,
  }),
}))
