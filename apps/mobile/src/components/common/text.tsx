import { useRef, useState } from 'react'
import {
  Text as Component,
  type FontVariant,
  type TextProps,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type Font, fonts } from '~/lib/fonts'
import { mapColors, stripProps } from '~/lib/styles'
import { usePreferences } from '~/stores/preferences'
import { getMargin, type MarginProps } from '~/styles/space'
import { type TextStyleProps, weights } from '~/styles/text'
import { colors } from '~/styles/tokens'

type Props = TextProps & TextStyleProps & MarginProps

export function Text({
  accent,
  children,
  color = 'gray',
  contrast,
  highContrast,
  style,
  ...props
}: Props) {
  const { font, fontScaling, systemScaling } = usePreferences()

  const fixed = useRef(false)

  const [height, setHeight] = useState<number>()

  styles.useVariants({
    accent,
    color,
    contrast,
    highContrast,
  })

  return (
    <Component
      {...stripProps(props)}
      allowFontScaling={systemScaling}
      onLayout={(event) => {
        props.onLayout?.(event)

        if (fixed.current) {
          return
        }

        const next = Math.round(event.nativeEvent.layout.height)

        if (next !== event.nativeEvent.layout.height) {
          setHeight(next + 1)

          fixed.current = true
        }
      }}
      style={[
        styles.main(props, font, systemScaling ? 1 : fontScaling, height),
        style,
      ]}
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
    height?: number,
  ) => {
    const fontVariant: Array<FontVariant> = ['no-contextual', 'stylistic-four']

    if (tabular) {
      fontVariant.push('tabular-nums')
    }

    return {
      ...getMargin(props),
      compoundVariants: colors.flatMap((token) => [
        {
          color: token,
          highContrast: true,
          styles: {
            color: theme.colors[token].text,
          },
        },
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
      ]),
      fontFamily: variant === 'mono' ? fonts.mono : fonts[font],
      fontSize: theme.typography[size].fontSize * scaling,
      fontStyle: italic ? 'italic' : 'normal',
      fontVariant,
      fontWeight: weights[weight],
      height,
      lineHeight: theme.typography[size].lineHeight * scaling,
      textAlign: align,
      variants: {
        accent: {
          true: {},
        },
        color: mapColors((token) => ({
          color: theme.colors[token].textLow,
        })),
        contrast: {
          true: {},
        },
        highContrast: {
          true: {},
        },
      },
    }
  },
}))
