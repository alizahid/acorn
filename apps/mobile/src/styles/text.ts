import { type TextStyle } from 'react-native'

import { type ColorToken, type TypographyToken } from '~/styles/tokens'

import { type MarginProps } from './space'

export type FontWeight = 'light' | 'regular' | 'medium' | 'bold'

export const weights: Record<FontWeight, TextStyle['fontWeight']> = {
  bold: '700',
  light: '300',
  medium: '500',
  regular: '400',
}

export type TextStyleProps = {
  accent?: boolean
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
