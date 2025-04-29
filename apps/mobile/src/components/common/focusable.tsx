import { type Ref, useImperativeHandle } from 'react'

type Focusable = {
  focus: () => void
}

type Props = {
  onFocus: () => void
  ref?: Ref<Focusable>
}

export function Focusable({ onFocus, ref }: Props) {
  useImperativeHandle(ref, () => ({
    focus() {
      onFocus()
    },
  }))

  return null
}
