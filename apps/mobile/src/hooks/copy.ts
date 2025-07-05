// biome-ignore lint/performance/noNamespaceImport: go away
import * as Clipboard from 'expo-clipboard'
import { useCallback, useRef, useState } from 'react'

export function useCopy() {
  const timer = useRef<NodeJS.Timeout>(null)

  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (value: string) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    await Clipboard.setStringAsync(value)

    setCopied(true)

    timer.current = setTimeout(() => {
      setCopied(false)
    }, 3000)
  }, [])

  return {
    copied,
    copy,
  }
}
