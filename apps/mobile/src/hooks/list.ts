import { StyleSheet, type VirtualizedListProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const ListFlags = {
  ALL: 1 | 2 | 4 | 8,
  BOTTOM: 4 | 8,
  BOTTOM_INSET: 4,
  HEADER: 2,
  TAB_BAR: 8,
  TOP: 1 | 2,
  TOP_INSET: 1,
}

export type ListProps<Type = unknown> = Pick<
  VirtualizedListProps<Type>,
  | 'contentInset'
  | 'keyboardDismissMode'
  | 'keyboardShouldPersistTaps'
  | 'scrollIndicatorInsets'
>

type Props = {
  bottom?: number
  top?: number
}

export function useList<Type>(
  flags = ListFlags.ALL,
  props?: Props,
): ListProps<Type> {
  const height = 48 + StyleSheet.hairlineWidth

  const insets = useSafeAreaInsets()

  const start = props?.top ?? 0
  const end = props?.bottom ?? 0

  let top = start
  let bottom = end

  if (flags & ListFlags.TOP_INSET) {
    top += insets.top
  }

  if (flags & ListFlags.HEADER) {
    top += height
  }

  if (flags & ListFlags.BOTTOM_INSET) {
    bottom += insets.bottom
  }

  if (flags & ListFlags.TAB_BAR) {
    bottom += height
  }

  return {
    contentInset: {
      bottom,
      top,
    },
    keyboardDismissMode: 'on-drag',
    keyboardShouldPersistTaps: 'handled',
    scrollIndicatorInsets: {
      bottom: flags & ListFlags.TAB_BAR ? height + end : end,
      right: 1,
      top: flags & ListFlags.HEADER ? height + start : start,
    },
  }
}
