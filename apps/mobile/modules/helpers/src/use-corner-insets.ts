import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { Helpers } from './module'
import { type CornerInsets } from './types'

const zero: CornerInsets = {
  left: 0,
  right: 0,
}

// Window controls only exist on iPad (Stage Manager) and Mac Catalyst;
// skip the native call and subscription everywhere else.
const enabled =
  Platform.OS === 'ios' && (Platform.isPad || Platform.isMacCatalyst)

export function useCornerInsets() {
  const [insets, setInsets] = useState<CornerInsets>(() =>
    enabled ? Helpers.getCornerInsets() : zero,
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    const subscription = Helpers.addListener('onCornerInsetsChange', (next) => {
      setInsets((current) =>
        current.left === next.left && current.right === next.right
          ? current
          : next,
      )
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return insets
}
