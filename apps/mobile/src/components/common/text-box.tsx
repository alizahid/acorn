import { forwardRef, useState } from 'react'
import {
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from './text'

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
  style?: StyleProp<ViewStyle>
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
    multiline,
    onBlur,
    onChangeText,
    onFocus,
    onSubmitEditing,
    placeholder,
    returnKeyType,
    secureTextEntry,
    style,
    styleInput,
    value,
  },
  ref,
) {
  const { styles, theme } = useStyles(stylesheet)

  const [focused, setFocused] = useState(false)

  return (
    <View style={[styles.main, style]}>
      {label ? (
        <Text color="gray" size="2" weight="medium">
          {label}
        </Text>
      ) : null}

      <TextInput
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
        placeholderTextColor={theme.colors.gray.a9}
        ref={ref}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        selectionColor={theme.colors.accent.a9}
        style={[
          styles.input(
            focused,
            Boolean(error),
            Boolean(multiline),
            Boolean(code),
          ),
          styleInput,
        ]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />

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

const stylesheet = createStyleSheet((theme) => ({
  input: (
    focused: boolean,
    error: boolean,
    multiline: boolean,
    code: boolean,
  ) => ({
    backgroundColor: theme.colors.gray.a2,
    borderColor: focused
      ? error
        ? theme.colors.red.a8
        : theme.colors.accent.a8
      : error
        ? theme.colors.red.a7
        : theme.colors.gray.a7,
    borderRadius: theme.radius[3],
    borderWidth: 1,
    color: theme.colors.gray.a12,
    fontFamily: code ? 'mono-regular' : 'sans-regular',
    fontSize: theme.typography[3].fontSize,
    height: multiline ? theme.space[9] : theme.space[7],
    paddingHorizontal: theme.space[3],
    paddingVertical: multiline ? theme.space[3] : 0,
  }),
  main: {
    gap: theme.space[1],
  },
}))
