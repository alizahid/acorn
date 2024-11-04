import * as Clipboard from 'expo-clipboard'
import { useCallback, useRef, useState } from 'react'

export function useCopy() {
  const timer = useRef<NodeJS.Timeout>()

  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (value: string) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    await Clipboard.setStringAsync(value)

    setCopied(true)

    timer.current = setTimeout(() => {
      setCopied(false)
    }, 3_000)
  }, [])

  return {
    copied,
    copy,
  }
}