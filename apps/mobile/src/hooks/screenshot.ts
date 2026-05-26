import { useMutation } from '@tanstack/react-query'
import { type RefObject } from 'react'
import { PixelRatio, type View } from 'react-native'
import { captureRef } from 'react-native-view-shot'

type Props = {
  onCapturing?: (capturing: boolean) => void
}

export function useScreenshot({ onCapturing }: Props) {
  const { mutateAsync, isPending } = useMutation<
    string,
    Error,
    RefObject<View | null>
  >({
    async mutationFn(ref) {
      onCapturing?.(true)

      await new Promise(requestAnimationFrame)

      return captureRef(ref.current, {
        result: 'tmpfile',
        width: 1080 / PixelRatio.get(),
      })
    },
    onSettled() {
      onCapturing?.(false)
    },
  })

  return {
    isPending,
    screenshot: mutateAsync,
  }
}
