import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'

export function useKeyboard() {
  const keyboard = useAnimatedKeyboard()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => {
      setVisible(true)
    })

    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setVisible(false)
    })

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  const styles = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }))

  return {
    dismiss,
    styles,
    visible,
  }
}

function dismiss() {
  Keyboard.dismiss()
}
