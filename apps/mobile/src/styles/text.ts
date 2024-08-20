import { type FontVariant } from 'react-native'
import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles/lib/typescript/src/types'

import { type ColorToken } from '~/styles/colors'
import { type TypographyToken } from '~/styles/tokens'

import { getMargin, type MarginProps } from './space'

export type TextStyleProps = {
  align?: 'left' | 'center' | 'right'
  color?: ColorToken
  contrast?: boolean
  highContrast?: boolean
  size?: TypographyToken
  tabular?: boolean
  variant?: 'sans' | 'mono'
  weight?: 'light' | 'regular' | 'medium' | 'bold'
} & MarginProps

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
    ...props
  }: TextStyleProps) {
    const fontVariant: Array<FontVariant> = ['stylistic-four']

    if (tabular) {
      fontVariant.push('tabular-nums')
    }

    return {
      ...getMargin(theme)(props),
      color:
        theme.colors[color][
          contrast ? 'contrast' : highContrast ? 'a12' : 'a11'
        ],
      fontFamily: `${variant}-${weight}`,
      fontSize: theme.typography[size].fontSize,
      fontVariant,
      lineHeight: theme.typography[size].lineHeight,
      textAlign: align,
    } satisfies UnistylesValues
  }
}
