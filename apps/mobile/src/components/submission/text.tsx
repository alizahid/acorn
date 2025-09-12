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

import { IconButton } from '../common/icon/button'
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
                <IconButton
                  icon={{
                    color: state?.isH1 ? 'accent' : 'gray',
                    name: 'TextHOne',
                    weight: state?.isH1 ? 'bold' : 'regular',
                  }}
                  label={a11y('toggleHeading')}
                  onPress={() => {
                    editor?.current?.toggleH1()
                  }}
                />

                <IconButton
                  icon={{
                    color: state?.isBold ? 'accent' : 'gray',
                    name: 'TextB',
                    weight: state?.isBold ? 'bold' : 'regular',
                  }}
                  label={a11y('toggleBold')}
                  onPress={() => {
                    editor?.current?.toggleBold()
                  }}
                />

                <IconButton
                  icon={{
                    color: state?.isItalic ? 'accent' : 'gray',
                    name: 'TextItalic',
                    weight: state?.isItalic ? 'bold' : 'regular',
                  }}
                  label={a11y('toggleItalic')}
                  onPress={() => {
                    editor?.current?.toggleItalic()
                  }}
                />

                <IconButton
                  icon={{
                    color: state?.isStrikeThrough ? 'accent' : 'gray',
                    name: 'TextStrikethrough',
                    weight: state?.isStrikeThrough ? 'bold' : 'regular',
                  }}
                  label={a11y('toggleStrikethrough')}
                  onPress={() => {
                    editor?.current?.toggleStrikeThrough()
                  }}
                />
              </View>

              <View direction="row">
                <IconButton
                  icon={{
                    color: state?.isUnorderedList ? 'accent' : 'gray',
                    name: 'ListDashes',
                    weight: state?.isUnorderedList ? 'bold' : 'regular',
                  }}
                  label={a11y('toggleUnorderedList')}
                  onPress={() => {
                    editor?.current?.toggleUnorderedList()
                  }}
                />

                <IconButton
                  icon={{
                    color: state?.isOrderedList ? 'accent' : 'gray',
                    name: 'ListNumbers',
                    weight: state?.isOrderedList ? 'bold' : 'regular',
                  }}
                  label={a11y('toggleOrderedList')}
                  onPress={() => {
                    editor?.current?.toggleOrderedList()
                  }}
                />
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
