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

  const tabBarHeight =
    theme.space[4] + theme.space[5] + insets.bottom + theme.space[4]

  const maxHeight = frame.height - headerHeight - tabBarHeight - theme.space[9]

  const listProps = useCallback(
    ({ header, tabBar }: { header?: boolean; tabBar?: boolean }) => ({
      removeClippedSubviews: true,
      scrollIndicatorInsets: {
        bottom: tabBar ? tabBarHeight - insets.bottom + 1 : 1,
        right: 1,
        top: header ? headerHeight - insets.top + 1 : 1,
      },
    }),
    [headerHeight, insets.bottom, insets.top, tabBarHeight],
  )

  return {
    frame,
    headerHeight,
    insets,
    listProps,
    maxHeight,
    tabBarHeight,
  }
}
