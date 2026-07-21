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
import {
  KeyboardController,
  useKeyboardState,
} from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
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
  const { font, fontScaling, systemScaling } = usePreferences(
    useShallow((state) => ({
      font: state.font,
      fontScaling: state.fontScaling,
      systemScaling: state.systemScaling,
    })),
  )

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

  const visible = useKeyboardState(({ isVisible }) => isVisible)

  return (
    <View style={[styles.toolBar, style]}>
      <IconButton
        accessibilityLabel={a11y('toggleBold')}
        onPress={() => {
          editor?.current?.toggleBold()
        }}
      >
        <Icon
          name={state?.bold.isActive ? 'text-b-bold' : 'text-b'}
          uniProps={(theme) => ({
            color: state?.bold.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </IconButton>

      <IconButton
        accessibilityLabel={a11y('toggleItalic')}
        onPress={() => {
          editor?.current?.toggleItalic()
        }}
      >
        <Icon
          name={state?.italic.isActive ? 'text-italic-bold' : 'text-italic'}
          uniProps={(theme) => ({
            color: state?.italic.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </IconButton>

      <IconButton
        accessibilityLabel={a11y('toggleStrikethrough')}
        onPress={() => {
          editor?.current?.toggleStrikethrough()
        }}
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
      </IconButton>

      <IconButton
        accessibilityLabel={a11y('toggleSpoiler')}
        onPress={() => {
          editor?.current?.toggleSpoiler()
        }}
      >
        <Icon
          name={state?.spoiler.isActive ? 'eye-closed-bold' : 'eye-closed'}
          uniProps={(theme) => ({
            color: state?.spoiler.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </IconButton>

      {visible ? (
        <IconButton
          accessibilityLabel={a11y('dismissKeyboard')}
          onPress={() => {
            KeyboardController.dismiss()
          }}
          style={styles.dismiss}
        >
          <Icon
            name="caret-down"
            uniProps={(theme) => ({
              color: theme.colors.gray.textLow,
            })}
          />
        </IconButton>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  dismiss: {
    marginLeft: 'auto',
  },
  main: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[4],
  }),
  toolBar: {
    flexDirection: 'row',
  },
}))

export const MarkdownEditor = {
  Root,
  ToolBar,
}
