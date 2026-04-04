import { useEffect, useState } from 'react'
import { KeyboardEvents } from 'react-native-keyboard-controller'

export function useKeyboard(type: 'will' | 'did' = 'will') {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = KeyboardEvents.addListener(
      type === 'will' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setVisible(true)
      },
    )

    const hide = KeyboardEvents.addListener(
      type === 'will' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setVisible(false)
      },
    )

    return () => {
      show.remove()
      hide.remove()
    }
  }, [type])

  return visible
}
