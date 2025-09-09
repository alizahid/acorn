import { clamp } from 'lodash'
import { useRef } from 'react'
import { type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'

import { mitter } from '~/lib/mitt'

export function useStickyNav() {
  const previous = useRef(0)
  const last = useRef<'show-nav' | 'hide-nav' | undefined>(undefined)

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const y = clamp(
      event.nativeEvent.contentOffset.y,
      0,
      event.nativeEvent.contentOffset.y,
    )

    const delta = y - previous.current

    const next = delta > 0 ? 'hide-nav' : 'show-nav'

    if (next !== last.current) {
      mitter.emit(next)
    }

    last.current = next

    previous.current = y
  }

  return {
    onScroll,
    scrollEventThrottle: 1000,
  }
}
