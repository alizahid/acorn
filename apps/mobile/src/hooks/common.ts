import { useCallback } from 'react'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { useStyles } from 'react-native-unistyles'

export function useCommon() {
  const insets = useSafeAreaInsets()
  const frame = useSafeAreaFrame()

  const { theme } = useStyles()

  const height = {
    communities: insets.top + 64,
    header: insets.top + theme.space[8],
    max: frame.height * 0.6,
    search: insets.top + 120,
    tabBar: insets.bottom + theme.space[4] + theme.space[5] + theme.space[4],
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

      if (communities) {
        top += height.communities - insets.top
      }

      if (header) {
        top += height.header - insets.top
      }

      if (search) {
        top += height.search - insets.top
      }

      const bottom = tabBar ? height.tabBar - insets.bottom + 1 : 1

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
