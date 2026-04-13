import { type Ref } from 'react'
import { type TextStyle, type ViewStyle } from 'react-native'
import {
  type EnrichedMarkdownInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'

import { EnrichedInput } from '../native/markdown'

type Props = {
  onChange?: (value: string) => void
  onChangeState?: (state: StyleState) => void
  placeholder?: string
  value?: string
  style?: ViewStyle | TextStyle
  ref?: Ref<EnrichedMarkdownInputInstance>
}

export function MarkdownEditor({
  onChange,
  onChangeState,
  placeholder,
  style,
  value,
  ref,
}: Props) {
  return (
    <EnrichedInput
      autoFocus
      defaultValue={value}
      multiline
      onChangeMarkdown={onChange}
      onChangeState={onChangeState}
      placeholder={placeholder}
      ref={ref}
      style={style}
    />
  )
}
