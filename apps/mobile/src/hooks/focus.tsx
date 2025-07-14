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

  const isFocused = useIsFocused()

  return (
    <FocusContext
      value={{
        focused: focused && isFocused,
        setFocused(next) {
          setFocused(next)
        },
      }}
    >
      {children}
    </FocusContext>
  )
}

export function useFocused() {
  return useContext(FocusContext)
}
