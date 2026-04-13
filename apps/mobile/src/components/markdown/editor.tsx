import { useRef } from 'react'
import { type TextStyle, type ViewStyle } from 'react-native'
import { type EnrichedMarkdownInputInstance } from 'react-native-enriched-markdown'

import { EnrichedInput } from '../native/markdown'

type Props = {
  onChange?: (value: string) => void
  placeholder?: string
  value?: string
  style?: ViewStyle | TextStyle
}

export function MarkdownEditor({ onChange, placeholder, style, value }: Props) {
  const ref = useRef<EnrichedMarkdownInputInstance>(null)

  return (
    <EnrichedInput
      autoFocus
      defaultValue={value}
      multiline
      onChangeMarkdown={onChange}
      placeholder={placeholder}
      ref={ref}
      style={style}
    />
  )
}
