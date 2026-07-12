import { type FlashListProps } from '@shopify/flash-list'
import { createElement } from 'react'
import { Dimensions, type Insets, type ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { heights } from '~/lib/common'

const { height } = Dimensions.get('window')

export type ListProps = ReturnType<typeof useListProps>

type Props = {
  bottom?: boolean
  extraBottom?: number
  extraTop?: number
  header?: boolean
  modal?: boolean
  tabBar?: boolean
  top?: boolean
}

export function useListProps({
  bottom = true,
  extraBottom,
  extraTop,
  header = true,
  modal,
  tabBar = true,
  top = true,
}: Props) {
  const insets = useSafeAreaInsets()

  const contentInset = {
    bottom: 0,
    top: 0,
  } satisfies Insets

  const scrollIndicatorInsets = {
    bottom: 1,
    right: 1,
    top: 1,
  } satisfies Insets

  if (modal) {
    contentInset.top += 32
    scrollIndicatorInsets.top += 32
  } else if (top) {
    contentInset.top += insets.top
    scrollIndicatorInsets.top += insets.top
  }

  if (header) {
    contentInset.top += heights.header
    scrollIndicatorInsets.top += heights.header
  }

  if (extraTop) {
    contentInset.top += extraTop
  }

  if (bottom) {
    contentInset.bottom += insets.bottom
  }

  if (tabBar) {
    contentInset.bottom += heights.tabBar
    scrollIndicatorInsets.bottom += heights.tabBar
  }

  if (extraBottom) {
    contentInset.bottom += extraBottom
  }

  return {
    automaticallyAdjustContentInsets: false,
    contentInset,
    contentInsetAdjustmentBehavior: 'never',
    contentOffset: {
      x: 0,
      y: -contentInset.top,
    },
    drawDistance: height / 2,
    keyboardDismissMode: 'on-drag',
    keyboardShouldPersistTaps: 'handled',
    renderScrollComponent,
    scrollIndicatorInsets,
  } satisfies Omit<FlashListProps<unknown>, 'data' | 'renderItem'>
}

export function renderScrollComponent({ children, ...props }: ScrollViewProps) {
  return createElement(ScrollView, props, children)
}
