import { useCallback } from 'react'
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  maxWidth: number
}

type PlayProps = {
  current: number
  duration: number
}

type PauseProps = {
  current: number
  duration: number
}

export function useMediaControls({ maxWidth }: Props) {
  const width = useSharedValue(0)

  const play = useCallback(
    ({ current, duration }: PlayProps) => {
      width.set((current / duration) * maxWidth)

      width.set(() =>
        withTiming(maxWidth, {
          duration: (duration - current) * 1_000,
          easing: Easing.linear,
        }),
      )
    },
    [maxWidth, width],
  )

  const pause = useCallback(
    ({ current, duration }: PauseProps) => {
      cancelAnimation(width)

      width.set((current / duration) * maxWidth)
    },
    [maxWidth, width],
  )

  const style = useAnimatedStyle(() => ({
    width: width.get(),
  }))

  return {
    pause,
    play,
    style,
    width,
  }
}
