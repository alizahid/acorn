import { type Ref } from 'react'
import {
  type EnrichedMarkdownTextInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { MarkdownEditor } from '~/components/native/markdown'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

type Props = {
  autoFocus?: boolean
  onChange?: (value: string) => void
  onChangeState?: (state: StyleState) => void
  placeholder?: string
  value?: string
  ref?: Ref<EnrichedMarkdownTextInputInstance>
}

export function EditorRoot({
  autoFocus,
  onChange,
  onChangeState,
  placeholder,
  value,
  ref,
}: Props) {
  const { font, fontScaling, systemScaling } = usePreferences(
    useShallow((state) => ({
      font: state.font,
      fontScaling: state.fontScaling,
      systemScaling: state.systemScaling,
    })),
  )

  return (
    <MarkdownEditor
      autoFocus={autoFocus}
      defaultValue={value}
      multiline
      onChangeMarkdown={onChange}
      onChangeState={onChangeState}
      placeholder={placeholder}
      ref={ref}
      style={styles.main(font, systemScaling ? 1 : fontScaling)}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
  }),
}))
