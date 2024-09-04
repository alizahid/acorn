import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function useCommon() {
  const insets = useSafeAreaInsets()
  const frame = useWindowDimensions()

  const height = {
    max: frame.height * 0.5,
  }

  const listProps = {
    scrollIndicatorInsets: {
      bottom: 1,
      right: 1,
      top: 1,
    },
  } as const

  return {
    frame,
    height,
    insets,
    listProps,
  }
}
