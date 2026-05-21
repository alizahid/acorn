import { useNavigation } from 'expo-router/react-navigation'
import { useEffect } from 'react'

export function useTabPress(name: 'tabPress', callback: () => void) {
  const navigation = useNavigation()

  useEffect(() => {
    const tabs = navigation.getParent()

    const unsubscribe = tabs?.addListener(name as unknown as 'focus', () => {
      callback()
    })

    return () => {
      unsubscribe?.()
    }
  }, [callback, name, navigation])
}
