import { type FlashListProps } from '@shopify/flash-list'
import { createElement } from 'react'
import { Dimensions, type ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const { height } = Dimensions.get('window')

const scrollProps = {
  automaticallyAdjustContentInsets: true,
  contentInsetAdjustmentBehavior: 'automatic',
  keyboardDismissMode: 'on-drag',
  keyboardShouldPersistTaps: 'handled',
  scrollIndicatorInsets: {
    bottom: 1,
    right: 1,
    top: 1,
  },
  scrollToOverflowEnabled: true,
} satisfies ScrollViewProps

const flashProps = {
  ...scrollProps,
  drawDistance: height / 2,
  maintainVisibleContentPosition: {
    disabled: true,
  },
  renderScrollComponent,
} satisfies Omit<FlashListProps<unknown>, 'data' | 'renderItem'>

export type ListProps = typeof flashProps

export function useListProps(flash: true): typeof flashProps
export function useListProps(flash?: false): typeof scrollProps
export function useListProps(flash = false) {
  if (flash) {
    return flashProps
  }

  return scrollProps
}

export function renderScrollComponent({ children, ...props }: ScrollViewProps) {
  return createElement(ScrollView, props, children)
}
