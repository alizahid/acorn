import { type FontVariant, type TextStyle } from 'react-native'
import { type Record } from 'react-native-phosphor'
import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles/lib/typescript/src/types'

import { type Font, fonts } from '~/lib/fonts'
import { type ColorToken, type TypographyToken } from '~/styles/tokens'

import { getMargin, type MarginProps } from './space'

export type FontWeight = 'light' | 'regular' | 'medium' | 'bold'

export type TextStyleProps = {
  align?: 'left' | 'center' | 'right'
  color?: ColorToken
  contrast?: boolean
  highContrast?: boolean
  italic?: boolean
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
      italic,
      weight = 'regular',
      ...props
    }: TextStyleProps,
    font: Font,
    scaling: number,
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
      fontFamily: variant === 'mono' ? fonts.mono : fonts[font],
      fontSize: theme.typography[size].fontSize * scaling,
      fontStyle: italic ? 'italic' : 'normal',
      fontVariant,
      fontWeight: weights[weight],
      lineHeight: theme.typography[size].lineHeight * scaling,
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

export function addTextSize(
  size: TypographyToken,
  by: number,
): TypographyToken {
  const next = Number(size) + by

  if (next < 1) {
    return '1'
  }

  if (next > 9) {
    return '9'
  }

  return String(next) as TypographyToken
}
