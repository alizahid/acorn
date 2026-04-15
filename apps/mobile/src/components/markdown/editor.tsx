import { type Ref, type RefObject } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import {
  type EditorStyleState,
  type MarkdownEditorHandle,
} from 'react-native-fast-markdown'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { PhosphorIcon } from '../common/icon/phosphor'
import { Pressable } from '../common/pressable'
import { MarkdownInput } from '../native/markdown'

type RootProps = {
  onChange?: (value: string) => void
  onChangeState?: (state: EditorStyleState) => void
  placeholder?: string
  value?: string
  style?: StyleProp<ViewStyle>
  ref?: Ref<MarkdownEditorHandle>
}

function Root({
  onChange,
  onChangeState,
  placeholder,
  style,
  value,
  ref,
}: RootProps) {
  const { font, fontScaling } = usePreferences()

  return (
    <MarkdownInput
      autoFocus
      defaultValue={value}
      multiline
      onChangeMarkdown={onChange}
      onChangeState={onChangeState}
      placeholder={placeholder}
      ref={ref}
      style={[styles.main(font, fontScaling), style]}
    />
  )
}

type ToolBarProps = {
  editor?: RefObject<MarkdownEditorHandle | null>
  state?: EditorStyleState
  style?: StyleProp<ViewStyle>
}

function ToolBar({ editor, state, style }: ToolBarProps) {
  const a11y = useTranslations('a11y')

  return (
    <View style={[styles.toolBar, style]}>
      <Pressable
        accessibilityLabel={a11y('toggleBold')}
        onPress={() => {
          editor?.current?.toggleBold()
        }}
        style={styles.tool}
      >
        <PhosphorIcon
          name="TextB"
          uniProps={(theme) => ({
            color: state?.bold
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
          weight={state?.bold ? 'bold' : 'regular'}
        />
      </Pressable>

      <Pressable
        accessibilityLabel={a11y('toggleItalic')}
        onPress={() => {
          editor?.current?.toggleItalic()
        }}
        style={styles.tool}
      >
        <PhosphorIcon
          name="TextItalic"
          uniProps={(theme) => ({
            color: state?.italic
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
          weight={state?.italic ? 'bold' : 'regular'}
        />
      </Pressable>

      <Pressable
        accessibilityLabel={a11y('toggleStrikethrough')}
        onPress={() => {
          editor?.current?.toggleStrikethrough()
        }}
        style={styles.tool}
      >
        <PhosphorIcon
          name="TextStrikethrough"
          uniProps={(theme) => ({
            color: state?.strikethrough
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
          weight={state?.strikethrough ? 'bold' : 'regular'}
        />
      </Pressable>

      <Pressable
        accessibilityLabel={a11y('toggleSpoiler')}
        onPress={() => {
          editor?.current?.toggleSpoiler()
        }}
        style={styles.tool}
      >
        <PhosphorIcon
          name="EyeClosed"
          uniProps={(theme) => ({
            color: state?.spoiler
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
          weight={state?.spoiler ? 'bold' : 'regular'}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    gap: theme.space[1],
    lineHeight: theme.typography[3].lineHeight * scaling,
  }),
  tool: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
    width: theme.space[8],
  },
  toolBar: {
    flexDirection: 'row',
  },
}))

export const MarkdownEditor = {
  Root,
  ToolBar,
}
