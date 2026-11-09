import { type FlashListProps } from '@shopify/flash-list'
import { createElement, useMemo } from 'react'
import { Dimensions, type ScrollViewProps, type ViewStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { maxWidth } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'

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
  renderScrollComponent,
} satisfies Omit<FlashListProps<unknown>, 'data' | 'renderItem'>

const centered = {
  alignSelf: 'center',
  maxWidth,
  width: '100%',
} satisfies ViewStyle

type Content = {
  contentContainerStyle?: ViewStyle
}

export type ListProps = typeof flashProps & Content

export function useListProps(flash: true): ListProps
export function useListProps(flash?: false): typeof scrollProps & Content

export function useListProps(flash = false) {
  const fullWidth = usePreferences((state) => state.fullWidth)

  return useMemo(() => {
    const props = flash ? flashProps : scrollProps

    if (fullWidth) {
      return props
    }

    return {
      ...props,
      contentContainerStyle: centered,
    }
  }, [flash, fullWidth])
}

function renderScrollComponent({ children, ...props }: ScrollViewProps) {
  return createElement(ScrollView, props, children)
}
