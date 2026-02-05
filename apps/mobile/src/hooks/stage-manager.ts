/** biome-ignore-all lint/correctness/useHookAtTopLevel: go away */

import { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { useDebounce } from 'use-debounce'

import { iPad } from '~/lib/common'

export function useStageManager() {
  if (!iPad) {
    return false
  }

  const frame = useSafeAreaFrame()

  const [height] = useDebounce(frame.height, 1000)
  const [width] = useDebounce(frame.width, 1000)

  return useMemo(() => {
    const dimensions = Dimensions.get('screen')

    return width < dimensions.width || height < dimensions.height
  }, [height, width])
}
