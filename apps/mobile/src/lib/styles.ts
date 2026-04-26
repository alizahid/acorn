import { omit } from 'lodash'
import { type TextStyle, type ViewStyle } from 'react-native'

import { type MarginProps, type PaddingProps } from '~/styles/space'
import { type FontWeight, type TextStyleProps, weights } from '~/styles/text'
import {
  type ColorToken,
  colors,
  type TypographyToken,
  typography,
} from '~/styles/tokens'
import { type ViewStyleProps } from '~/styles/view'

import { type Font, fonts } from './fonts'

export function stripProps<Type extends object>(
  props: Type | TextStyleProps | ViewStyleProps | MarginProps | PaddingProps,
): Type {
  return omit(props, [
    'align',
    'color',
    'direction',
    'flex',
    'flexBasis',
    'flexGrow',
    'flexShrink',
    'gap',
    'gapX',
    'gapY',
    'height',
    'italic',
    'justify',
    'm',
    'mb',
    'ml',
    'mr',
    'mt',
    'mx',
    'my',
    'p',
    'pb',
    'pl',
    'pr',
    'pt',
    'px',
    'py',
    'self',
    'size',
    'tabular',
    'weight',
    'width',
    'wrap',
  ]) as Type
}

export function mapColors<Type extends TextStyle | ViewStyle>(
  mapper: (token: ColorToken) => Type,
) {
  return Object.fromEntries(colors.map((token) => [token, mapper(token)]))
}

export function mapTypography<Type extends TextStyle>(
  mapper: (token: TypographyToken) => Type,
) {
  return Object.fromEntries(
    Object.keys(typography).map((token) => [
      token,
      mapper(token as TypographyToken),
    ]),
  )
}

export function mapFonts<Type extends TextStyle | ViewStyle>(
  mapper: (token: Font, fontFamily: string) => Type,
) {
  return Object.fromEntries(
    Object.entries(fonts).map(([token, fontFamily]) => [
      token,
      mapper(token as Font, fontFamily),
    ]),
  )
}

export function mapWeights<Type extends TextStyle | ViewStyle>(
  mapper: (token: FontWeight, fontWeight: TextStyle['fontWeight']) => Type,
) {
  return Object.fromEntries(
    Object.entries(weights).map(([token, fontWeight]) => [
      token,
      mapper(token as FontWeight, fontWeight),
    ]),
  )
}
