import { useIsFocused } from '@react-navigation/native'
import { createContext, type ReactNode, useContext, useState } from 'react'

type FocusContext = {
  focused: boolean
  setFocused: (focused: boolean) => void
}

// @ts-expect-error
const FocusContext = createContext<FocusContext>({
  focused: true,
})

type Props = {
  children: ReactNode
}

export function FocusProvider({ children }: Props) {
  const [focused, setFocused] = useState(true)

  return (
    <FocusContext
      value={{
        focused,
        setFocused,
      }}
    >
      {children}
    </FocusContext>
  )
}

export function useFocused() {
  const { focused, setFocused } = useContext(FocusContext)

  const isFocused = useIsFocused()

  return {
    focused: isFocused && focused,
    setFocused,
  }
}
