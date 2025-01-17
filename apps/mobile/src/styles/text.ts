import { type FontVariant, type TextStyle } from 'react-native'
import { type Record } from 'react-native-phosphor'
import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles/lib/typescript/src/types'

import { fonts } from '~/lib/fonts'
import { type ColorToken, type TypographyToken } from '~/styles/tokens'

import { getMargin, type MarginProps } from './space'

export type FontWeight = 'light' | 'regular' | 'medium' | 'bold'

export type TextStyleProps = {
  align?: 'left' | 'center' | 'right'
  color?: ColorToken
  contrast?: boolean
  highContrast?: boolean
  size?: TypographyToken
  tabular?: boolean
  variant?: 'sans' | 'mono'
  weight?: FontWeight
} & MarginProps

export function getTextStyles(theme: UnistylesTheme) {
  return function styles(
    {
      align = 'left',
      color = 'gray',
      variant = 'sans',
      contrast = false,
      highContrast = color === 'gray',
      size = '3',
      tabular,
      weight = 'regular',
      ...props
    }: TextStyleProps,
    systemFont: boolean,
  ) {
    const fontVariant: Array<FontVariant> = ['no-contextual', 'stylistic-four']

    if (tabular) {
      fontVariant.push('tabular-nums')
    }

    return {
      ...getMargin(theme)(props),
      color:
        theme.colors[color][
          contrast ? 'contrast' : highContrast ? 'text' : 'textLow'
        ],
      fontFamily:
        variant === 'mono'
          ? fonts.mono
          : systemFont
            ? fonts.system
            : fonts.sans,
      fontSize: theme.typography[size].fontSize,
      fontVariant,
      fontWeight: weights[weight],
      lineHeight: theme.typography[size].lineHeight,
      textAlign: align,
    } satisfies UnistylesValues
  }
}

const weights: Record<FontWeight, TextStyle['fontWeight']> = {
  bold: '700',
  light: '300',
  medium: '500',
  regular: '400',
}
