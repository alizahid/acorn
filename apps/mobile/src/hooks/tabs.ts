import { useNavigation } from 'expo-router'
import { useEffect, useRef } from 'react'

type Options = {
  double?: boolean
  focused?: boolean
}

export function useTabPress(func: () => unknown, options?: Options) {
  const navigation = useNavigation()

  const lastPress = useRef(0)

  useEffect(() => {
    const navigator = navigation.getParent('/(tabs)')

    const listener = navigator?.addListener('tabPress' as 'focus', () => {
      if (options?.focused && !navigation.isFocused()) {
        return
      }

      if (options?.double) {
        const now = Date.now()

        if (now - lastPress.current > 250) {
          lastPress.current = now

          return
        }

        lastPress.current = 0
      }

      func()
    })

    return () => {
      listener?.()
    }
  }, [func, navigation, options])
}
