import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles/lib/typescript/src/types'

import { type fonts } from '~/lib/fonts'
import { type ColorToken } from '~/styles/colors'
import { type TypographyToken } from '~/styles/tokens'

export type TextStyleProps = {
  align?: 'left' | 'center' | 'right'
  color?: ColorToken
  contrast?: boolean
  highContrast?: boolean
  size?: TypographyToken
  tabular?: boolean
  weight?: keyof typeof fonts
}

export function getTextStyles(theme: UnistylesTheme) {
  return function styles({
    align = 'left',
    color = 'gray',
    contrast = false,
    highContrast = color === 'gray',
    size = '3',
    tabular,
    weight = 'regular',
  }: TextStyleProps) {
    return {
      color:
        theme.colors[`${color}A`][
          contrast ? 'contrast' : highContrast ? 12 : 11
        ],
      fontFamily: weight,
      fontSize: theme.typography[size].fontSize,
      fontVariant: tabular ? ['tabular-nums'] : undefined,
      fontWeight:
        weight === 'bold'
          ? '700'
          : weight === 'medium'
            ? '500'
            : weight === 'light'
              ? '300'
              : '400',
      lineHeight: theme.typography[size].lineHeight,
      textAlign: align,
    } satisfies UnistylesValues
  }
}
