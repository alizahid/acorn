import { type FlashListProps } from '@shopify/flash-list'
import { createElement } from 'react'
import { Dimensions, type ScrollViewProps } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'

const { height } = Dimensions.get('window')

export const listProps = {
  contentInsetAdjustmentBehavior: 'automatic',
  drawDistance: height * 2,
  keyboardDismissMode: 'on-drag',
  keyboardShouldPersistTaps: 'handled',
  renderScrollComponent,
  scrollIndicatorInsets: {
    bottom: 1,
    right: 1,
    top: 1,
  },
} satisfies Omit<FlashListProps<unknown>, 'data' | 'renderItem'>

export function renderScrollComponent({ children, ...props }: ScrollViewProps) {
  return createElement(
    IOScrollView,
    {
      ...props,
      threshold: 1,
    },
    children,
  )
}
