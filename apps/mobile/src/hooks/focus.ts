import { useIsFocused } from '@react-navigation/native'
import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useState,
} from 'react'

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

  return createElement(
    FocusContext,
    {
      value: {
        focused,
        setFocused,
      },
    },
    children,
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
