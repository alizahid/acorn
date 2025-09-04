import { type ReactNode, type Ref, useState } from 'react'
import {
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { TextInput } from '../native/text-input'
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
  error?: string
  hint?: string
  label?: string
  left?: ReactNode
  ref?: Ref<TextInput>
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  styleContent?: StyleProp<ViewStyle>
  styleInput?: StyleProp<TextStyle>
  variant?: 'sans' | 'mono'
}

export function TextBox({
  autoCapitalize,
  autoComplete,
  autoCorrect,
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
  ref,
  returnKeyType,
  right,
  secureTextEntry,
  style,
  styleContent,
  styleInput,
  value,
  variant = 'sans',
}: Props) {
  const { font, fontScaling, systemScaling } = usePreferences()

  const [focused, setFocused] = useState(false)

  styles.useVariants({
    error: Boolean(error),
    focused,
    multiline,
    variant,
  })

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
        style={[styles.content, styleContent]}
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
          ref={ref}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          style={[styles.input(font, fontScaling), styleInput]}
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
}

const styles = StyleSheet.create((theme) => ({
  content: {
    backgroundColor: theme.colors.gray.ui,
    borderColor: theme.colors.gray.borderUi,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    borderWidth: StyleSheet.hairlineWidth,
    compoundVariants: [
      {
        error: true,
        focused: true,
        styles: {
          borderColor: theme.colors.red.accent,
        },
      },
    ],
    flexGrow: 1,
    variants: {
      error: {
        true: {
          borderColor: theme.colors.red.borderUi,
        },
      },
      focused: {
        true: {
          borderColor: theme.colors.accent.accent,
        },
      },
    },
  },
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontSize: theme.typography[3].fontSize * scaling,
    paddingHorizontal: theme.space[3],
    variants: {
      multiline: {
        false: {
          height: theme.space[7],
        },
        true: {
          paddingVertical: theme.space[3],
        },
      },
      variant: {
        mono: {
          fontFamily: fonts.mono,
        },
        sans: {
          fontFamily: fonts[font],
        },
      },
    },
  }),
  main: {
    gap: theme.space[1],
  },
}))
