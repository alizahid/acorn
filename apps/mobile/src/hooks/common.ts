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

  const headerHeight = insets.top + theme.space[8]

  const pagerHeaderHeight = insets.top + 64

  const searchHeaderHeight = insets.top + 120

  const tabBarHeight =
    insets.bottom + theme.space[4] + theme.space[5] + theme.space[4]

  const maxHeight = frame.height - headerHeight - tabBarHeight - theme.space[9]

  const listProps = useCallback(
    ({
      header,
      pager,
      search,
      tabBar,
    }: {
      header?: boolean
      pager?: boolean
      search?: boolean
      tabBar?: boolean
    }) => {
      const top = search
        ? searchHeaderHeight - insets.top + 1
        : pager
          ? pagerHeaderHeight - insets.top + 1
          : header
            ? headerHeight - insets.top + 1
            : 1

      const bottom = tabBar ? tabBarHeight - insets.bottom + 1 : 1

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
      headerHeight,
      insets.bottom,
      insets.top,
      pagerHeaderHeight,
      searchHeaderHeight,
      tabBarHeight,
    ],
  )

  return {
    frame,
    headerHeight,
    insets,
    listProps,
    maxHeight,
    pagerHeaderHeight,
    searchHeaderHeight,
    tabBarHeight,
  }
}
