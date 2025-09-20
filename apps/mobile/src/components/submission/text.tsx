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
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { PhosphorIcon } from '../common/icon/phosphor'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { Editor } from '../native/editor'

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
    marginBottom: interpolate(progress.get(), [0, 1], [0, 48]),
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
              onChangeText={field.onChange}
              placeholder={t('placeholder')}
              ref={editor}
              style={styles.input(font, fontScaling)}
            />
          </Animated.View>

          <Portal>
            <Sticky style={[styles.toolbar, stickyStyle]}>
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
                    color={state?.isH1 ? 'accent' : 'gray'}
                    name="TextHOne"
                    weight={state?.isH1 ? 'bold' : 'regular'}
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
                    color={state?.isBold ? 'accent' : 'gray'}
                    name="TextB"
                    weight={state?.isBold ? 'bold' : 'regular'}
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
                    color={state?.isItalic ? 'accent' : 'gray'}
                    name="TextItalic"
                    weight={state?.isItalic ? 'bold' : 'regular'}
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
                    color={state?.isStrikeThrough ? 'accent' : 'gray'}
                    name="TextStrikethrough"
                    weight={state?.isStrikeThrough ? 'bold' : 'regular'}
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
                    color={state?.isUnorderedList ? 'accent' : 'gray'}
                    name="ListDashes"
                    weight={state?.isUnorderedList ? 'bold' : 'regular'}
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
                    color={state?.isOrderedList ? 'accent' : 'gray'}
                    name="ListNumbers"
                    weight={state?.isOrderedList ? 'bold' : 'regular'}
                  />
                </Pressable>
              </View>
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
  toolbar: {
    backgroundColor: theme.colors.gray.bgAlt,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    right: 0,
  },
}))
