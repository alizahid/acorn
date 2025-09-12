import { type ReactNode } from 'react'
import {
  Text as Component,
  type FontVariant,
  type StyleProp,
  type TextStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { getMargin } from '~/styles/space'
import { type TextStyleProps, weights } from '~/styles/text'
import { ColorTokens } from '~/styles/tokens'

type Props = TextStyleProps & {
  children: ReactNode
  label?: string
  lines?: number
  onPress?: () => void
  selectable?: boolean
  style?: StyleProp<TextStyle>
}

export function Text({
  accent,
  children,
  color = 'gray',
  contrast,
  highContrast = color === 'gray',
  label,
  lines,
  onPress,
  selectable,
  style,
  ...props
}: Props) {
  const { font, fontScaling, systemScaling } = usePreferences()

  styles.useVariants({
    accent,
    color,
    contrast,
    highContrast,
  })

  return (
    <Component
      accessibilityLabel={label}
      allowFontScaling={systemScaling}
      ellipsizeMode={lines ? 'tail' : undefined}
      numberOfLines={lines}
      onPress={onPress}
      selectable={selectable}
      style={[styles.main(props, font, systemScaling ? 1 : fontScaling), style]}
    >
      {children}
    </Component>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (
    {
      align = 'left',
      variant = 'sans',
      size = '3',
      tabular,
      italic,
      weight = 'regular',
      ...props
    }: TextStyleProps,
    font: Font,
    scaling: number,
  ) => {
    const fontVariant: Array<FontVariant> = ['no-contextual', 'stylistic-four']

    if (tabular) {
      fontVariant.push('tabular-nums')
    }

    return {
      ...getMargin(props),
      compoundVariants: ColorTokens.flatMap((token) => [
        {
          accent: true,
          color: token,
          styles: {
            color: theme.colors[token].accent,
          },
        },
        {
          color: token,
          contrast: true,
          styles: {
            color: theme.colors[token].contrast,
          },
        },
        {
          color: token,
          highContrast: true,
          styles: {
            color: theme.colors[token].text,
          },
        },
      ]),
      fontFamily: variant === 'mono' ? fonts.mono : fonts[font],
      fontSize: theme.typography[size].fontSize * scaling,
      fontStyle: italic ? 'italic' : 'normal',
      fontVariant,
      fontWeight: weights[weight],
      lineHeight: theme.typography[size].lineHeight * scaling,
      textAlign: align,
      variants: {
        accent: {
          true: {
            color: theme.colors.accent.accent,
          },
        },
        color: Object.fromEntries(
          ColorTokens.map((token) => [
            token,
            {
              color: theme.colors[token].textLow,
            },
          ]),
        ),
        contrast: {
          true: {
            color: theme.colors.accent.contrast,
          },
        },
        highContrast: {
          true: {
            color: theme.colors.accent.text,
          },
        },
      },
    }
  },
}))
