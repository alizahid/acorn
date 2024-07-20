import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { useStyles } from 'react-native-unistyles'

export function useFrame() {
  const insets = useSafeAreaInsets()
  const frame = useSafeAreaFrame()

  const { theme } = useStyles()

  return {
    frame,
    insets,
    padding: {
      bottom: insets.bottom + theme.space[4] + theme.space[5] + theme.space[4],
      top: insets.top + theme.space[8],
    },
    scroll: {
      bottom: theme.space[4] + theme.space[5] + theme.space[4] + 1,
      right: 1,
      top: theme.space[8] + 1,
    },
  }
}
