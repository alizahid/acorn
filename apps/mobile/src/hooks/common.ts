import { useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function useCommon() {
  const insets = useSafeAreaInsets()
  const frame = useWindowDimensions()

  const height = {
    communities: insets.top + 64,
    header: insets.top + 48,
    max: frame.height * 0.6,
    search: insets.top + 120,
    tabBar: insets.bottom + 56,
  }

  const listProps = useCallback(
    ({
      communities,
      header,
      search,
      tabBar,
    }: {
      communities?: boolean
      header?: boolean
      search?: boolean
      tabBar?: boolean
    }) => {
      let top = 1
      let bottom = 1

      if (communities) {
        top += height.communities - insets.top
      }

      if (header) {
        top += height.header - insets.top
      }

      if (search) {
        top += height.search - insets.top
      }

      if (tabBar) {
        bottom += height.tabBar - insets.bottom
      }

      return {
        removeClippedSubviews: true,
        scrollIndicatorInsets: {
          bottom,
          right: 1,
          top,
        },
      }
    },
    [
      height.communities,
      height.header,
      height.search,
      height.tabBar,
      insets.bottom,
      insets.top,
    ],
  )

  return {
    frame,
    height,
    insets,
    listProps,
  }
}
