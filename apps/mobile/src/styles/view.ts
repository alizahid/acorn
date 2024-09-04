import { type FlexStyle } from 'react-native'
import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles/lib/typescript/src/types'

import { type SpaceToken } from '~/styles/tokens'

import {
  getMargin,
  getPadding,
  type MarginProps,
  type PaddingProps,
} from './space'

export type ViewStyleProps = {
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexBasis?: number
  flexGrow?: number
  flexShrink?: number
  gap?: SpaceToken | number
  gapX?: SpaceToken | number
  gapY?: SpaceToken | number
  height?: SpaceToken | number
  justify?: 'start' | 'center' | 'end' | 'between'
  width?: SpaceToken | number
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
} & MarginProps &
  PaddingProps

export function getViewStyles(theme: UnistylesTheme) {
  return function styles({
    align,
    direction,
    flexBasis,
    flexGrow,
    flexShrink,
    gap,
    gapX,
    gapY,
    height,
    justify,
    width,
    wrap,
    ...props
  }: ViewStyleProps) {
    const alignItems: FlexStyle['alignItems'] =
      align === 'baseline'
        ? 'baseline'
        : align === 'center'
          ? 'center'
          : align === 'end'
            ? 'flex-end'
            : align === 'start'
              ? 'flex-start'
              : align === 'stretch'
                ? 'stretch'
                : undefined

    const justifyContent: FlexStyle['justifyContent'] =
      justify === 'between'
        ? 'space-between'
        : justify === 'center'
          ? 'center'
          : justify === 'end'
            ? 'flex-end'
            : justify === 'start'
              ? 'flex-start'
              : undefined

    return {
      ...getMargin(theme)(props),
      ...getPadding(theme)(props),
      alignItems,
      columnGap: getSpace(theme, gapY),
      flexBasis,
      flexDirection: direction,
      flexGrow,
      flexShrink,
      flexWrap: wrap,
      gap: getSpace(theme, gap),
      height: getSpace(theme, height),
      justifyContent,
      rowGap: getSpace(theme, gapX),
      width: getSpace(theme, width),
    } satisfies UnistylesValues
  }
}

function getSpace(theme: UnistylesTheme, key?: SpaceToken | number) {
  if (!key) {
    return
  }

  if (typeof key === 'number') {
    return key
  }

  return theme.space[key]
}
