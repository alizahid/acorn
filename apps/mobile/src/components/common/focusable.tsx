import { forwardRef, useImperativeHandle } from 'react'

type Focusable = {
  focus: () => void
}

type Props = {
  onFocus: () => void
}

export const Focusable = forwardRef<Focusable, Props>(function Component(
  { onFocus },
  ref,
) {
  useImperativeHandle(ref, () => ({
    focus() {
      onFocus()
    },
  }))

  return null
})
