import { type FlashListProps } from '@shopify/flash-list'
import { createElement } from 'react'
import { Dimensions, type ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { heights } from '~/lib/common'

const { height } = Dimensions.get('window')

export type ListProps = ReturnType<typeof useListProps>

type Props = {
  bottom?: boolean
  extraBottom?: number
  extraTop?: number
  flash?: boolean
  header?: boolean
  modal?: boolean
  tabBar?: boolean
  top?: boolean
}

export function useListProps({
  bottom = true,
  extraBottom,
  extraTop,
  flash = true,
  header = true,
  modal,
  tabBar = true,
  top = true,
}: Props) {
  const insets = useSafeAreaInsets()

  const props = {
    automaticallyAdjustContentInsets: false,
    contentInset: {
      bottom: 0,
      top: 0,
    },
    contentInsetAdjustmentBehavior: 'never',
    contentOffset: {
      x: 0,
      y: 0,
    },
    keyboardDismissMode: 'on-drag',
    keyboardShouldPersistTaps: 'handled',
    scrollIndicatorInsets: {
      bottom: 1,
      right: 1,
      top: 1,
    },
  } satisfies Omit<FlashListProps<unknown>, 'data' | 'renderItem'>

  if (modal) {
    props.contentInset.top += 32
    props.scrollIndicatorInsets.top += 32
  } else if (top) {
    props.contentInset.top += insets.top
    props.scrollIndicatorInsets.top += insets.top
  }

  if (header) {
    props.contentInset.top += heights.header
    props.scrollIndicatorInsets.top += heights.header
  }

  if (extraTop) {
    props.contentInset.top += extraTop
  }

  if (bottom) {
    props.contentInset.bottom += insets.bottom
  }

  if (tabBar) {
    props.contentInset.bottom += heights.tabBar
    props.scrollIndicatorInsets.bottom += heights.tabBar
  }

  if (extraBottom) {
    props.contentInset.bottom += extraBottom
  }

  props.contentOffset.y = -props.contentInset.top

  if (flash) {
    return {
      ...props,
      drawDistance: height / 2,
      renderScrollComponent,
    }
  }

  return props
}

export function renderScrollComponent({ children, ...props }: ScrollViewProps) {
  return createElement(ScrollView, props, children)
}
