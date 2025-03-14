import { useScrollToTop as useScroll } from '@react-navigation/native'
import { type FlashList } from '@shopify/flash-list'
import { type RefObject, useRef } from 'react'
import { type FlatList } from 'react-native'

import { type ListProps } from './list'

export function useScrollToTop<Type>(
  ref: RefObject<FlatList<Type> | FlashList<Type>>,
  props?: ListProps<Type>,
) {
  useScroll(
    useRef({
      scrollToTop() {
        if (!ref.current) {
          return
        }

        if ('scrollToOffset' in ref.current) {
          ref.current.scrollToOffset({
            animated: true,
            offset: -(props?.contentInset?.top ?? 0),
          })
        }
      },
    }),
  )
}
