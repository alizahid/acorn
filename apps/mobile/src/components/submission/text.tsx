import { Portal } from '@gorhom/portal'
import { useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  type EnrichedTextInputInstance,
  type OnChangeStateEvent,
} from 'react-native-enriched'
import {
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller'
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type CreatePostForm } from '~/hooks/mutations/posts/create'
import { glass } from '~/lib/common'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { PhosphorIcon } from '../common/icon/phosphor'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { Editor } from '../native/editor'
import { GlassView } from '../native/glass-view'

const Sticky = Animated.createAnimatedComponent(KeyboardStickyView)

export function SubmissionText() {
  const { font, fontScaling } = usePreferences()

  const t = useTranslations('component.submission.text')
  const a11y = useTranslations('a11y')

  const { control } = useFormContext<CreatePostForm>()

  const { progress } = useReanimatedKeyboardAnimation()

  const editor = useRef<EnrichedTextInputInstance>(null)

  const [state, setState] = useState<OnChangeStateEvent>()

  const editorStyle = useAnimatedStyle(() => ({
    flexGrow: 1,
    marginBottom: interpolate(progress.get(), [0, 1], [0, glass ? 64 : 48]),
  }))

  const stickyStyle = useAnimatedStyle(() => ({
    bottom: interpolate(progress.get(), [0, 1], [-100, 0]),
  }))

  return (
    <Controller
      control={control}
      name="text"
      render={({ field, fieldState }) => (
        <View flexGrow={1}>
          {fieldState.error ? (
            <Text mx="4" size="2" style={styles.error}>
              {fieldState.error.message}
            </Text>
          ) : null}

          <Animated.View style={editorStyle}>
            <Editor
              onChangeHtml={(event) => {
                field.onChange(event.nativeEvent.value)
              }}
              onChangeState={(event) => {
                setState(event.nativeEvent)
              }}
              placeholder={t('placeholder')}
              ref={editor}
              style={styles.input(font, fontScaling)}
            />
          </Animated.View>

          <Portal>
            <Sticky style={[styles.sticky, stickyStyle]}>
              <GlassView style={styles.tools}>
                <View direction="row">
                  <Pressable
                    accessibilityLabel={a11y('toggleHeading')}
                    align="center"
                    height="8"
                    justify="center"
                    onPress={() => {
                      editor?.current?.toggleH1()
                    }}
                    width="8"
                  >
                    <PhosphorIcon
                      name="TextHOne"
                      uniProps={(theme) => ({
                        color: state?.h1.isActive
                          ? theme.colors.accent.accent
                          : theme.colors.gray.accent,
                      })}
                      weight={state?.h1.isActive ? 'bold' : 'regular'}
                    />
                  </Pressable>

                  <Pressable
                    accessibilityLabel={a11y('toggleBold')}
                    align="center"
                    height="8"
                    justify="center"
                    onPress={() => {
                      editor?.current?.toggleBold()
                    }}
                    width="8"
                  >
                    <PhosphorIcon
                      name="TextB"
                      uniProps={(theme) => ({
                        color: state?.bold.isActive
                          ? theme.colors.accent.accent
                          : theme.colors.gray.accent,
                      })}
                      weight={state?.bold.isActive ? 'bold' : 'regular'}
                    />
                  </Pressable>

                  <Pressable
                    accessibilityLabel={a11y('toggleItalic')}
                    align="center"
                    height="8"
                    justify="center"
                    onPress={() => {
                      editor?.current?.toggleItalic()
                    }}
                    width="8"
                  >
                    <PhosphorIcon
                      name="TextItalic"
                      uniProps={(theme) => ({
                        color: state?.bold.isActive
                          ? theme.colors.accent.accent
                          : theme.colors.gray.accent,
                      })}
                      weight={state?.bold.isActive ? 'bold' : 'regular'}
                    />
                  </Pressable>

                  <Pressable
                    accessibilityLabel={a11y('toggleStrikethrough')}
                    align="center"
                    height="8"
                    justify="center"
                    onPress={() => {
                      editor?.current?.toggleStrikeThrough()
                    }}
                    width="8"
                  >
                    <PhosphorIcon
                      name="TextStrikethrough"
                      uniProps={(theme) => ({
                        color: state?.strikeThrough.isActive
                          ? theme.colors.accent.accent
                          : theme.colors.gray.accent,
                      })}
                      weight={
                        state?.strikeThrough.isActive ? 'bold' : 'regular'
                      }
                    />
                  </Pressable>
                </View>

                <View direction="row">
                  <Pressable
                    accessibilityLabel={a11y('toggleUnorderedList')}
                    align="center"
                    height="8"
                    justify="center"
                    onPress={() => {
                      editor?.current?.toggleUnorderedList()
                    }}
                    width="8"
                  >
                    <PhosphorIcon
                      name="ListDashes"
                      uniProps={(theme) => ({
                        color: state?.unorderedList.isActive
                          ? theme.colors.accent.accent
                          : theme.colors.gray.accent,
                      })}
                      weight={
                        state?.unorderedList.isActive ? 'bold' : 'regular'
                      }
                    />
                  </Pressable>

                  <Pressable
                    accessibilityLabel={a11y('toggleOrderedList')}
                    align="center"
                    height="8"
                    justify="center"
                    onPress={() => {
                      editor?.current?.toggleOrderedList()
                    }}
                    width="8"
                  >
                    <PhosphorIcon
                      name="ListNumbers"
                      uniProps={(theme) => ({
                        color: state?.orderedList.isActive
                          ? theme.colors.accent.accent
                          : theme.colors.gray.accent,
                      })}
                      weight={state?.orderedList.isActive ? 'bold' : 'regular'}
                    />
                  </Pressable>
                </View>
              </GlassView>
            </Sticky>
          </Portal>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  error: {
    color: theme.colors.red.accent,
  },
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flexGrow: 1,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
  }),
  sticky: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  tools: {
    backgroundColor: glass ? undefined : theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: glass ? theme.radius[4] : undefined,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: glass ? theme.space[4] : undefined,
  },
}))
