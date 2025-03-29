import { forwardRef, type ReactNode, useState } from 'react'
import {
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { Text } from './text'
import { View } from './view'

type Props = Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'editable'
  | 'keyboardType'
  | 'multiline'
  | 'onBlur'
  | 'onChangeText'
  | 'onFocus'
  | 'onSubmitEditing'
  | 'placeholder'
  | 'returnKeyType'
  | 'secureTextEntry'
  | 'value'
> & {
  code?: boolean
  error?: string
  hint?: string
  label?: string
  left?: ReactNode
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  styleContent?: StyleProp<ViewStyle>
  styleInput?: StyleProp<TextStyle>
}

export const TextBox = forwardRef<TextInput, Props>(function Component(
  {
    autoCapitalize,
    autoComplete,
    autoCorrect,
    code,
    editable = true,
    error,
    hint,
    keyboardType,
    label,
    left,
    multiline,
    onBlur,
    onChangeText,
    onFocus,
    onSubmitEditing,
    placeholder,
    returnKeyType,
    right,
    secureTextEntry,
    style,
    styleContent,
    styleInput,
    value,
  },
  ref,
) {
  const { font, fontScaling, systemScaling } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [focused, setFocused] = useState(false)

  return (
    <View style={[styles.main, style]}>
      {label ? (
        <Text color="gray" size="2" weight="medium">
          {label}
        </Text>
      ) : null}

      <View
        align="center"
        direction="row"
        style={[styles.content(focused, Boolean(error)), styleContent]}
      >
        {left}

        <TextInput
          allowFontScaling={systemScaling}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          editable={editable}
          keyboardType={keyboardType}
          multiline={multiline}
          onBlur={(event) => {
            setFocused(false)

            onBlur?.(event)
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true)

            onFocus?.(event)
          }}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray.accent}
          ref={ref}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          selectionColor={theme.colors.accent.accent}
          style={[
            styles.input(Boolean(multiline), Boolean(code), font, fontScaling),
            styleInput,
          ]}
          textAlignVertical="center"
          value={value}
        />

        {right}
      </View>

      {hint ? (
        <Text color="gray" size="2">
          {hint}
        </Text>
      ) : null}

      {error ? (
        <Text color="red" size="2">
          {error}
        </Text>
      ) : null}
    </View>
  )
})

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: (focused: boolean, error: boolean) => ({
    backgroundColor: theme.colors.gray.ui,
    borderColor: focused
      ? error
        ? theme.colors.red.accent
        : theme.colors.accent.accent
      : error
        ? theme.colors.red.borderUi
        : theme.colors.gray.borderUi,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    borderWidth: runtime.hairlineWidth,
    flexGrow: 1,
  }),
  input: (multiline: boolean, code: boolean, font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontFamily: code ? fonts.mono : fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    height: multiline ? undefined : theme.space[7],
    paddingHorizontal: theme.space[3],
    paddingVertical: multiline ? theme.space[3] : undefined,
  }),
  main: {
    gap: theme.space[1],
  },
}))
