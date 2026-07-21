import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import {
  type EnrichedMarkdownTextInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'

import { Text } from '../common/text'
import { MarkdownEditor } from '../markdown/editor'

export function SubmissionText() {
  const t = useTranslations('component.submission.text')

  const { control } = useFormContext<CreatePostForm>()

  const editor = useRef<EnrichedMarkdownTextInputInstance>(null)

  const [state, setState] = useState<StyleState>()

  return (
    <>
      <MarkdownEditor.ToolBar
        editor={editor}
        state={state}
        style={styles.toolBar}
      />

      <Controller
        control={control}
        name="text"
        render={({ field, fieldState }) => (
          <View style={styles.main}>
            {fieldState.error ? (
              <Text mx="4" size="2" style={styles.error}>
                {fieldState.error.message}
              </Text>
            ) : null}

            <KeyboardAvoidingView
              automaticOffset
              behavior="padding"
              style={styles.editor}
            >
              <MarkdownEditor.Root
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
  error: {
    color: theme.colors.red.accent,
  },
  main: {
    flex: 1,
  },
  toolBar: {
    backgroundColor: theme.colors.gray.uiAlpha,
  },
}))
