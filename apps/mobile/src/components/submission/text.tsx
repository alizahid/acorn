import { useIsFocused } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import {
  type EnrichedTextInputInstance,
  type OnChangeStateEvent,
} from 'react-native-enriched'
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
import { Editor } from '../native/editor'

export function SubmissionText() {
  const focused = useIsFocused()

  const t = useTranslations('component.submission.text')
  const a11y = useTranslations('a11y')

  const { font, fontScaling } = usePreferences()

  const { control } = useFormContext<CreatePostForm>()

  const { progress } = useReanimatedKeyboardAnimation()

  const editor = useRef<EnrichedTextInputInstance>(null)

  const [state, setState] = useState<OnChangeStateEvent>()

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

          <Editor
            onChangeHtml={(event) => {
              field.onChange(event.nativeEvent.value)
            }}
            onChangeState={(event) => {
              setState(event.nativeEvent)
            }}
            placeholder={t('placeholder')}
            ref={editor}
            style={styles.editor(font, fontScaling)}
          />

          <KeyboardExtender enabled={focused}>
            <Animated.View style={[styles.tools, style]}>
              <View style={styles.section}>
                <Pressable
                  accessibilityLabel={a11y('toggleHeading')}
                  onPress={() => {
                    editor?.current?.toggleH1()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="TextHOne"
                    uniProps={(theme) => ({
                      color: state?.h1.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.h1.isActive ? 'bold' : 'regular'}
                  />
                </Pressable>

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
                    editor?.current?.toggleStrikeThrough()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="TextStrikethrough"
                    uniProps={(theme) => ({
                      color: state?.strikeThrough.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.strikeThrough.isActive ? 'bold' : 'regular'}
                  />
                </Pressable>
              </View>

              <View style={styles.section}>
                <Pressable
                  accessibilityLabel={a11y('toggleUnorderedList')}
                  onPress={() => {
                    editor?.current?.toggleUnorderedList()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="ListDashes"
                    uniProps={(theme) => ({
                      color: state?.unorderedList.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.unorderedList.isActive ? 'bold' : 'regular'}
                  />
                </Pressable>

                <Pressable
                  accessibilityLabel={a11y('toggleOrderedList')}
                  onPress={() => {
                    editor?.current?.toggleOrderedList()
                  }}
                  style={styles.item}
                >
                  <PhosphorIcon
                    name="ListNumbers"
                    uniProps={(theme) => ({
                      color: state?.orderedList.isActive
                        ? theme.colors.accent.accent
                        : theme.colors.gray.textLow,
                    })}
                    weight={state?.orderedList.isActive ? 'bold' : 'regular'}
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
