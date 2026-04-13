import { useIsFocused } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import {
  type EnrichedMarkdownInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
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
import { PhosphorIcon } from '../common/icon/phosphor'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { MarkdownEditor } from '../markdown/editor'

export function SubmissionText() {
  const focused = useIsFocused()

  const t = useTranslations('component.submission.text')
  const a11y = useTranslations('a11y')

  const { font, fontScaling } = usePreferences()

  const { control } = useFormContext<CreatePostForm>()

  const { progress } = useReanimatedKeyboardAnimation()

  const editor = useRef<EnrichedMarkdownInputInstance>(null)

  const [state, setState] = useState<StyleState>()

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

          <MarkdownEditor
            onChange={(markdown) => {
              field.onChange(markdown)
            }}
            onChangeState={setState}
            placeholder={t('placeholder')}
            ref={editor}
            style={styles.editor(font, fontScaling)}
          />

          <KeyboardExtender enabled={focused}>
            <Animated.View style={[styles.tools, style]}>
              <View style={styles.section}>
                <Pressable
                  accessibilityLabel={a11y('toggleBold')}
                  onPress={() => {
                    editor?.current?.toggleBold()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="TextB"
                    uniProps={(theme) => ({
                      color: state?.bold.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.bold.isActive ? 'bold' : 'regular'}
                  />
                </Pressable>

                <Pressable
                  accessibilityLabel={a11y('toggleItalic')}
                  onPress={() => {
                    editor?.current?.toggleItalic()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="TextItalic"
                    uniProps={(theme) => ({
                      color: state?.italic.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.italic.isActive ? 'bold' : 'regular'}
                  />
                </Pressable>

                <Pressable
                  accessibilityLabel={a11y('toggleStrikethrough')}
                  onPress={() => {
                    editor?.current?.toggleStrikethrough()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="TextStrikethrough"
                    uniProps={(theme) => ({
                      color: state?.strikethrough.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.strikethrough.isActive ? 'bold' : 'regular'}
                  />
                </Pressable>

                <Pressable
                  accessibilityLabel={a11y('toggleSpoiler')}
                  onPress={() => {
                    editor?.current?.toggleSpoiler()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="EyeClosed"
                    uniProps={(theme) => ({
                      color: state?.spoiler.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.spoiler.isActive ? 'bold' : 'regular'}
                  />
                </Pressable>
              </View>

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
  item: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
    width: theme.space[8],
  },
  main: {
    flex: 1,
  },
  section: {
    flexDirection: 'row',
  },
  tools: {
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: iOS26 ? 'center' : 'space-between',
  },
}))
