import { useIsFocused } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import {
  type EditorStyleState,
  type MarkdownEditorHandle,
} from 'react-native-fast-markdown'
import {
  KeyboardController,
  KeyboardExtender,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller'
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { iOS26 } from '~/lib/common'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { IconButton } from '../common/icon/button'
import { Text } from '../common/text'
import { MarkdownEditor } from '../markdown/editor'

export function SubmissionText() {
  const focused = useIsFocused()

  const t = useTranslations('component.submission.text')

  const { font, fontScaling, systemScaling } = usePreferences([
    'font',
    'fontScaling',
    'systemScaling',
  ])

  const { control } = useFormContext<CreatePostForm>()

  const { progress } = useReanimatedKeyboardAnimation()

  const editor = useRef<MarkdownEditorHandle>(null)

  const [state, setState] = useState<EditorStyleState>()

  const style = useAnimatedStyle(() => ({
    height: interpolate(progress.get(), [0, 1], [0, 48]),
  }))

  return (
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

          <MarkdownEditor.Root
            onChange={(markdown) => {
              field.onChange(markdown)
            }}
            onChangeState={setState}
            placeholder={t('placeholder')}
            ref={editor}
            style={styles.editor(font, systemScaling ? 1 : fontScaling)}
          />

          <KeyboardExtender enabled={focused}>
            <Animated.View style={[styles.tools, style]}>
              <MarkdownEditor.ToolBar editor={editor} state={state} />

              <IconButton
                color="gray"
                contrast
                icon="chevron.down"
                label="Dismiss"
                onPress={() => {
                  KeyboardController.dismiss()
                }}
              />
            </Animated.View>
          </KeyboardExtender>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  editor: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
  }),
  error: {
    color: theme.colors.red.accent,
  },
  main: {
    flex: 1,
  },
  tools: {
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: iOS26 ? 'center' : 'space-between',
  },
}))
