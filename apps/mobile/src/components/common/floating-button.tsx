import { BlurView } from 'expo-blur'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/tokens'

import { HeaderButton } from '../navigation/header-button'
import { type IconName } from './icon'

export const FloatingButtonSide = ['left', 'right', null] as const

export type FloatingButtonSide = (typeof FloatingButtonSide)[number]

type Props = {
  color?: ColorToken
  icon: IconName
  onLongPress?: () => void
  onPress?: () => void
  side?: 'right' | 'left'
  style?: StyleProp<ViewStyle>
}

export function FloatingButton({
  color = 'accent',
  icon,
  onLongPress,
  onPress,
  side = 'right',
  style,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <BlurView intensity={100} style={[styles.main(color, side), style]}>
      <HeaderButton
        color={color}
        hitSlop={theme.space[4]}
        icon={icon}
        onLongPress={onLongPress}
        onPress={onPress}
        weight="bold"
      />
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: (color: ColorToken, side: FloatingButtonSide) => ({
    backgroundColor: theme.colors[color].uiActiveAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom:
      runtime.insets.bottom +
      theme.space[3] +
      theme.space[5] +
      theme.space[3] +
      theme.space[4],
    left: side === 'left' ? theme.space[4] : undefined,
    overflow: 'hidden',
    position: 'absolute',
    right: side === 'right' ? theme.space[4] : undefined,
  }),
}))
