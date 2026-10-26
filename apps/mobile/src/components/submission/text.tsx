import { useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'
import {
  type EnrichedMarkdownTextInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '../common/text'
import { Markdown } from '../markdown'
import { useSubmission } from './provider'

export function SubmissionText() {
  const t = useTranslations('component.submission.text')

  const { form } = useSubmission()

  const editor = useRef<EnrichedMarkdownTextInputInstance>(null)

  const [state, setState] = useState<StyleState>()

  return (
    <>
      <Markdown.Editor.ToolBar
        editor={editor}
        state={state}
        style={styles.toolBar}
      />

      <Controller
        control={form.control}
        name="text"
        render={({ field, fieldState }) => (
          <View style={styles.editor}>
            {fieldState.error ? (
              <Text accent color="red" mt="2" mx="4" size="2">
                {fieldState.error.message}
              </Text>
            ) : null}

            <KeyboardAvoidingView
              automaticOffset
              behavior="padding"
              style={styles.editor}
            >
              <Markdown.Editor.Root
                onChange={(markdown) => {
                  field.onChange(markdown)
                }}
                onChangeState={setState}
                placeholder={t('placeholder')}
                ref={editor}
              />
            </KeyboardAvoidingView>
          </View>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  editor: {
    flex: 1,
  },
  toolBar: {
    backgroundColor: theme.colors.gray.uiAlpha,
  },
}))
