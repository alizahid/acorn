import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles'

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

export function getMargin(theme: UnistylesTheme) {
  return function styles({ m, mb, ml, mr, mt, mx, my }: MarginProps) {
    const style: UnistylesValues = {}

    if (m) {
      style.margin = getSpace(theme, m)
    }

    if (mb) {
      style.marginBottom = getSpace(theme, mb)
    }

    if (ml) {
      style.marginLeft = getSpace(theme, ml)
    }

    if (mr) {
      style.marginRight = getSpace(theme, mr)
    }

    if (mt) {
      style.marginTop = getSpace(theme, mt)
    }

    if (mx) {
      style.marginHorizontal = getSpace(theme, mx)
    }

    if (my) {
      style.marginVertical = getSpace(theme, my)
    }

    return style
  }
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

export function getPadding(theme: UnistylesTheme) {
  return function styles({ p, pb, pl, pr, pt, px, py }: PaddingProps) {
    const style: UnistylesValues = {}

    if (p) {
      style.padding = getSpace(theme, p)
    }

    if (pb) {
      style.paddingBottom = getSpace(theme, pb)
    }

    if (pl) {
      style.paddingLeft = getSpace(theme, pl)
    }

    if (pr) {
      style.paddingRight = getSpace(theme, pr)
    }

    if (pt) {
      style.paddingTop = getSpace(theme, pt)
    }

    if (px) {
      style.paddingHorizontal = getSpace(theme, px)
    }

    if (py) {
      style.paddingVertical = getSpace(theme, py)
    }

    return style
  }
}

function getSpace(theme: UnistylesTheme, key: MarginToken | PaddingToken) {
  if (typeof key === 'number') {
    return key
  }

  if (key === '0') {
    return 0
  }

  if (key === 'auto') {
    return 'auto'
  }

  const negative = key.startsWith('-')

  const token = (key.startsWith('-') ? key.slice(1) : key) as SpaceToken

  const value = theme.space[token]

  if (negative) {
    return -value
  }

  return value
}
