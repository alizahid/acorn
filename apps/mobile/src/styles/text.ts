import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles/lib/typescript/src/types'

import { type ColorToken } from '~/styles/colors'
import { type TypographyToken } from '~/styles/tokens'

export type TextStyleProps = {
  align?: 'left' | 'center' | 'right'
  color?: ColorToken
  contrast?: boolean
  highContrast?: boolean
  size?: TypographyToken
  tabular?: boolean
  variant?: 'sans' | 'mono'
  weight?: 'light' | 'regular' | 'medium' | 'bold'
}

export function getTextStyles(theme: UnistylesTheme) {
  return function styles({
    align = 'left',
    color = 'gray',
    variant = 'sans',
    contrast = false,
    highContrast = color === 'gray',
    size = '3',
    tabular,
    weight = 'regular',
  }: TextStyleProps) {
    return {
      color:
        theme.colors[color][
          contrast ? 'contrast' : highContrast ? 'a12' : 'a11'
        ],
      fontFamily: `${variant}-${weight}`,
      fontSize: theme.typography[size].fontSize,
      fontVariant: tabular ? ['tabular-nums'] : undefined,
      lineHeight: theme.typography[size].lineHeight,
      textAlign: align,
    } satisfies UnistylesValues
  }
}
