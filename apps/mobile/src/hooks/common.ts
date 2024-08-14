import { useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type Insets = Array<
  'top' | 'bottom' | 'header' | 'communities' | 'search' | 'tabBar'
>

type Offsets = [top: number, bottom: number]

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
    (inset: Insets = [], offsets: Offsets = [0, 0]) => {
      let progressViewOffset = 0

      const contentContainerStyle = {
        paddingBottom: offsets[1],
        paddingTop: offsets[0],
      }

      const scrollIndicatorInsets = {
        bottom: 1,
        right: 1,
        top: 1,
      }

      if (inset.includes('top')) {
        progressViewOffset += insets.top

        contentContainerStyle.paddingTop += insets.top
      }

      if (inset.includes('bottom')) {
        contentContainerStyle.paddingBottom += insets.bottom
      }

      if (inset.includes('header')) {
        progressViewOffset += height.header - insets.top

        contentContainerStyle.paddingTop += height.header - insets.top

        scrollIndicatorInsets.top += height.header - insets.top
      }

      if (inset.includes('communities')) {
        progressViewOffset += height.communities - insets.top

        contentContainerStyle.paddingTop += height.communities - insets.top

        scrollIndicatorInsets.top += height.communities - insets.top
      }

      if (inset.includes('search')) {
        progressViewOffset += height.search - insets.top

        contentContainerStyle.paddingTop += height.search - insets.top

        scrollIndicatorInsets.top += height.search - insets.top
      }

      if (inset.includes('tabBar')) {
        contentContainerStyle.paddingBottom += height.tabBar - insets.bottom

        scrollIndicatorInsets.bottom += height.tabBar - insets.bottom
      }

      return {
        contentContainerStyle,
        progressViewOffset,
        removeClippedSubviews: true,
        scrollIndicatorInsets,
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
