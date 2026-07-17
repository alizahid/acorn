import { type FlashListProps } from '@shopify/flash-list'
import { createElement } from 'react'
import { Dimensions, type ScrollViewProps } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const { height } = Dimensions.get('window')

export type ListProps = ReturnType<typeof useListProps>

export function useListProps(flash = false) {
  const props = {
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
  } satisfies Omit<FlashListProps<unknown>, 'data' | 'renderItem'>

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
