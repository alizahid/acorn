import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

export function useStickyHeader() {
  const frame = useSafeAreaFrame()

  const previousScrollY = useSharedValue(0)

  const scrollUp = useSharedValue(0)
  const scrollDown = useSharedValue(0)

  const visible = useSharedValue(true)

  const onScroll = useAnimatedScrollHandler((event) => {
    const y = event.contentOffset.y
    const deltaY = y - previousScrollY.get()

    if (deltaY > 0) {
      scrollUp.set(0)
      scrollDown.set((previous) => previous + deltaY)

      if (scrollDown.value > frame.height * 0.25 && visible.get()) {
        visible.set(false)

        scrollDown.set(0)
      }
    }

    if (deltaY < 0) {
      scrollDown.set(0)
      scrollUp.set((previous) => previous + -deltaY)

      if (scrollUp.value > frame.height * 0.25 && !visible.get()) {
        visible.set(true)

        scrollUp.set(0)
      }
    }

    previousScrollY.set(y)
  })

  return {
    onScroll,
    visible,
  }
}
