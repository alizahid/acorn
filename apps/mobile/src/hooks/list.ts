/** biome-ignore-all lint/suspicious/noBitwiseOperators: go away */

import { type FlashListProps } from '@shopify/flash-list'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import { heights } from '~/lib/common'

export const ListFlags = {
  ALL: 1 | 2 | 4 | 8,
  BOTTOM: 4 | 8,
  BOTTOM_INSET: 4,
  HEADER: 2,
  TAB_BAR: 8,
  TOP: 1 | 2,
  TOP_INSET: 1,
}

export type ListProps<Type = unknown> = Required<
  Pick<
    FlashListProps<Type>,
    | 'contentInset'
    | 'contentOffset'
    | 'drawDistance'
    | 'keyboardDismissMode'
    | 'keyboardShouldPersistTaps'
    | 'scrollIndicatorInsets'
  >
>

type Props = {
  bottom?: number
  top?: number
}

export function useList<Type>(
  flags = ListFlags.ALL,
  props?: Props,
): ListProps<Type> {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()

  const start = props?.top ?? 0
  const end = props?.bottom ?? 0

  let top = start
  let bottom = end

  if (flags & ListFlags.TOP_INSET) {
    top += insets.top
  }

  if (flags & ListFlags.HEADER) {
    top += heights.header
  }

  if (flags & ListFlags.BOTTOM_INSET) {
    bottom += insets.bottom
  }

  if (flags & ListFlags.TAB_BAR) {
    bottom += heights.tabBar
  }

  return {
    contentInset: {
      bottom,
      top,
    },
    contentOffset: {
      x: 0,
      y: -top,
    },
    drawDistance: frame.height * 2,
    keyboardDismissMode: 'on-drag',
    keyboardShouldPersistTaps: 'handled',
    scrollIndicatorInsets: {
      bottom: flags & ListFlags.TAB_BAR ? heights.tabBar + end : end,
      right: 1,
      top: flags & ListFlags.HEADER ? heights.header + start : start,
    },
  }
}
