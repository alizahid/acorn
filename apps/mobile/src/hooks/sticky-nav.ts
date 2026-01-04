import { clamp } from 'lodash'
import { useRef } from 'react'

import { mitter } from '~/lib/mitt'
import { usePreferences } from '~/stores/preferences'

type Props = {
  disabled?: boolean
}

export function useStickyNav({ disabled = false }: Props) {
  const { hideHeaderOnScroll, hideTabBarOnScroll } = usePreferences()

  const previous = useRef(0)
  const last = useRef<'show' | 'hide' | undefined>(undefined)

  function onScroll(offset: number) {
    if (disabled) {
      return
    }

    const y = clamp(offset, 0, offset)

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
  }
}
