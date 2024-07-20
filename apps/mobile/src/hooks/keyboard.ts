import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

export function useKeyboard() {
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

  const dismiss = () => {
    Keyboard.dismiss()
  }

  return {
    dismiss,
    visible,
  }
}
