import { useSafeAreaFrame } from 'react-native-safe-area-context'

import { cardMaxWidth, iPad } from '~/lib/common'
import { space } from '~/styles/tokens'

export type ContentWidthType = 'full' | 'about' | 'post' | 'comment'

type Props = {
  type: ContentWidthType
  depth?: number
}

export function useContentWidth({ type, depth = 0 }: Props) {
  const frame = useSafeAreaFrame()

  const maxWidth = iPad ? cardMaxWidth : frame.width

  if (type === 'about') {
    return maxWidth - space[4] * 2
  }

  if (type === 'post') {
    return maxWidth - space[3] * 2
  }

  if (type === 'comment') {
    return (
      maxWidth - space[3] * 2 - space[2] * depth - (depth > 0 ? space[1] : 0)
    )
  }

  return maxWidth
}
