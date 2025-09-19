import { clamp } from 'lodash'
import { useRef } from 'react'
import { type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'

import { mitter } from '~/lib/mitt'
import { usePreferences } from '~/stores/preferences'

export function useStickyNav() {
  const { hideHeaderOnScroll, hideTabBarOnScroll } = usePreferences()

  const previous = useRef(0)
  const last = useRef<'show' | 'hide' | undefined>(undefined)

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const y = clamp(
      event.nativeEvent.contentOffset.y,
      0,
      event.nativeEvent.contentOffset.y,
    )

    const delta = y - previous.current

    const next = delta > 0 ? 'hide' : 'show'

    if (next !== last.current) {
      if (hideHeaderOnScroll) {
        mitter.emit(next === 'hide' ? 'hide-header' : 'show-header')
      }

      if (hideTabBarOnScroll) {
        mitter.emit(next === 'hide' ? 'hide-tab-bar' : 'show-tab-bar')
      }
    }

    last.current = next
    previous.current = y
  }

  return {
    onScroll,
    scrollEventThrottle: 1000,
  }
}
