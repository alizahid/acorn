import { type Ref, type RefObject } from 'react'
import {
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import {
  type EnrichedMarkdownTextInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { MarkdownInput } from '../native/markdown'

type RootProps = {
  onChange?: (value: string) => void
  onChangeState?: (state: StyleState) => void
  placeholder?: string
  value?: string
  style?: ViewStyle | TextStyle
  ref?: Ref<EnrichedMarkdownTextInputInstance>
}

function Root({
  onChange,
  onChangeState,
  placeholder,
  style,
  value,
  ref,
}: RootProps) {
  const { font, fontScaling, systemScaling } = usePreferences((state) => ({
    font: state.font,
    fontScaling: state.fontScaling,
    systemScaling: state.systemScaling,
  }))

  return (
    <MarkdownInput
      autoFocus
      defaultValue={value}
      multiline
      onChangeMarkdown={onChange}
      onChangeState={onChangeState}
      placeholder={placeholder}
      ref={ref}
      style={StyleSheet.flatten([
        styles.main(font, systemScaling ? 1 : fontScaling),
        style,
      ])}
    />
  )
}

type ToolBarProps = {
  editor?: RefObject<EnrichedMarkdownTextInputInstance | null>
  state?: StyleState
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
        <Icon
          name={state?.bold.isActive ? 'text-b-bold' : 'text-b'}
          uniProps={(theme) => ({
            color: state?.bold.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </Pressable>

      <Pressable
        accessibilityLabel={a11y('toggleItalic')}
        onPress={() => {
          editor?.current?.toggleItalic()
        }}
        style={styles.tool}
      >
        <Icon
          name={state?.italic.isActive ? 'text-italic-bold' : 'text-italic'}
          uniProps={(theme) => ({
            color: state?.italic.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </Pressable>

      <Pressable
        accessibilityLabel={a11y('toggleStrikethrough')}
        onPress={() => {
          editor?.current?.toggleStrikethrough()
        }}
        style={styles.tool}
      >
        <Icon
          name={
            state?.strikethrough.isActive
              ? 'text-strikethrough-bold'
              : 'text-strikethrough'
          }
          uniProps={(theme) => ({
            color: state?.strikethrough.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </Pressable>

      <Pressable
        accessibilityLabel={a11y('toggleSpoiler')}
        onPress={() => {
          editor?.current?.toggleSpoiler()
        }}
        style={styles.tool}
      >
        <Icon
          name={state?.spoiler.isActive ? 'eye-closed-bold' : 'eye-closed'}
          uniProps={(theme) => ({
            color: state?.spoiler.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
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
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
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
