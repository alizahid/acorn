import { Text as Component, type TextProps } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import {
  mapColors,
  mapFonts,
  mapTypography,
  mapWeights,
  stripProps,
} from '~/lib/styles'
import { usePreferences } from '~/stores/preferences'
import { getMargin, type MarginProps } from '~/styles/space'
import { type TextStyleProps } from '~/styles/text'
import { colors } from '~/styles/tokens'

type Props = TextProps & TextStyleProps & MarginProps

export function Text({
  accent,
  align,
  children,
  color = 'gray',
  contrast,
  highContrast = color === 'gray',
  italic,
  size = '3',
  style,
  tabular,
  variant = 'sans',
  weight = 'regular',
  ...props
}: Props) {
  const { font, fontScaling, systemScaling } = usePreferences()

  styles.useVariants({
    accent,
    align,
    color,
    contrast,
    font: variant === 'mono' ? 'mono' : font,
    highContrast,
    italic,
    size,
    tabular,
    weight,
  })

  return (
    <Component
      {...stripProps(props)}
      allowFontScaling={systemScaling}
      style={[styles.main(props, systemScaling ? 1 : fontScaling), style]}
    >
      {children}
    </Component>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: (props: MarginProps, scaling: number) => ({
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
    variants: {
      accent: {
        true: {},
      },
      align: {
        center: {
          textAlign: 'center',
        },
        left: {
          textAlign: 'left',
        },
        right: {
          textAlign: 'right',
        },
      },
      color: mapColors((token) => ({
        color: theme.colors[token].textLow,
      })),
      contrast: {
        true: {},
      },
      font: mapFonts((_token, fontFamily) => ({
        fontFamily,
      })),
      highContrast: {
        true: {},
      },
      italic: {
        true: {
          fontStyle: 'italic',
        },
      },
      size: mapTypography((token) => ({
        fontSize: theme.typography[token].fontSize * scaling,
        lineHeight: theme.typography[token].lineHeight * scaling,
      })),
      tabular: {
        default: {
          fontVariant: ['stylistic-four'],
        },
        true: {
          fontVariant: ['stylistic-four', 'tabular-nums'],
        },
      },
      weight: mapWeights((_token, fontWeight) => ({
        fontWeight,
      })),
    },
  }),
}))
