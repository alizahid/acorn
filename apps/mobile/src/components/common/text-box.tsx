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
import { type MarginProps } from '~/styles/space'
import { type TextStyleProps } from '~/styles/text'
import { type TypographyToken } from '~/styles/tokens'

import { TextInput } from '../native/text-input'
import { View } from './view'

type Props = {
  left?: ReactNode
  ref?: Ref<TextInput>
  right?: ReactNode
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
  styleInput?: StyleProp<TextStyle>
  variant?: 'sans' | 'mono'
} & Omit<TextInputProps, 'style'> &
  TextStyleProps &
  MarginProps

export function TextBox({
  left,
  multiline,
  onBlur,
  onFocus,
  right,
  style,
  styleInput,
  variant = 'sans',
}: Props) {
  const { font, fontScaling, systemScaling } = usePreferences()

  const [focused, setFocused] = useState(false)

  styles.useVariants({
    focused,
    multiline,
    variant,
  })

  return (
    <View align="center" direction="row" gap="1" style={[styles.main, style]}>
      {left}

      <TextInput
        allowFontScaling={systemScaling}
        onBlur={(event) => {
          onBlur?.(event)

          setFocused(false)
        }}
        onFocus={(event) => {
          onFocus?.(event)

          setFocused(true)
        }}
        style={[styles.input(font, fontScaling), styleInput]}
        textAlignVertical="center"
      />

      {right}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontSize: theme.typography[3].fontSize * scaling,
    paddingHorizontal: theme.space[3],
    variants: {
      multiline: {
        default: {
          height: theme.space[7],
        },
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
    backgroundColor: theme.colors.gray.ui,
    borderColor: theme.colors.gray.borderUi,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    borderWidth: StyleSheet.hairlineWidth,
    variants: {
      focused: {
        true: {
          borderColor: theme.colors.accent.accent,
        },
      },
    },
  },
}))
