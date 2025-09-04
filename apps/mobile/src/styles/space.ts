import { type ViewStyle } from 'react-native'
import { UnistylesRuntime } from 'react-native-unistyles'

import { type SpaceToken } from './tokens'

export type MarginToken = '0' | 'auto' | SpaceToken | `-${SpaceToken}` | number

export type MarginProps = {
  m?: MarginToken
  mb?: MarginToken
  ml?: MarginToken
  mr?: MarginToken
  mt?: MarginToken
  mx?: MarginToken
  my?: MarginToken
}

export function getMargin({ m, mb, ml, mr, mt, mx, my }: MarginProps) {
  const style: Pick<
    ViewStyle,
    | 'margin'
    | 'marginBottom'
    | 'marginLeft'
    | 'marginRight'
    | 'marginTop'
    | 'marginHorizontal'
    | 'marginVertical'
  > = {}

  if (m) {
    style.margin = getSpace(m)
  }

  if (mb) {
    style.marginBottom = getSpace(mb)
  }

  if (ml) {
    style.marginLeft = getSpace(ml)
  }

  if (mr) {
    style.marginRight = getSpace(mr)
  }

  if (mt) {
    style.marginTop = getSpace(mt)
  }

  if (mx) {
    style.marginHorizontal = getSpace(mx)
  }

  if (my) {
    style.marginVertical = getSpace(my)
  }

  return style
}

export type PaddingToken = '0' | SpaceToken | `-${SpaceToken}` | number

export type PaddingProps = {
  p?: PaddingToken
  pb?: PaddingToken
  pl?: PaddingToken
  pr?: PaddingToken
  pt?: PaddingToken
  px?: PaddingToken
  py?: PaddingToken
}

export function getPadding({ p, pb, pl, pr, pt, px, py }: PaddingProps) {
  const style: Pick<
    ViewStyle,
    | 'padding'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingTop'
    | 'paddingHorizontal'
    | 'paddingVertical'
  > = {}

  if (p) {
    style.padding = getSpace(p)
  }

  if (pb) {
    style.paddingBottom = getSpace(pb)
  }

  if (pl) {
    style.paddingLeft = getSpace(pl)
  }

  if (pr) {
    style.paddingRight = getSpace(pr)
  }

  if (pt) {
    style.paddingTop = getSpace(pt)
  }

  if (px) {
    style.paddingHorizontal = getSpace(px)
  }

  if (py) {
    style.paddingVertical = getSpace(py)
  }

  return style
}

export function getSpace(key: MarginToken | PaddingToken) {
  if (typeof key === 'number') {
    return key
  }

  if (key === '0') {
    return 0
  }

  if (key === 'auto') {
    return 'auto'
  }

  const theme = UnistylesRuntime.getTheme()

  const negative = key.startsWith('-')

  const token = (key.startsWith('-') ? key.slice(1) : key) as SpaceToken

  const value = theme.space[token]

  if (negative) {
    return -value
  }

  return value
}
