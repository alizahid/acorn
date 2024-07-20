import { createElement, type ReactNode } from 'react'
import { type StyleProp, type TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type fonts } from '~/lib/fonts'
import { type ColorName } from '~/styles/colors'
import { type TypographyToken } from '~/styles/tokens'

type Props = {
  align?: 'left' | 'center' | 'right'
  children: ReactNode
  color?: ColorName
  contrast?: boolean
  highContrast?: boolean
  size?: TypographyToken
  style?: StyleProp<TextStyle>
  weight?: keyof typeof fonts
}

export function Text({
  align = 'left',
  children,
  color = 'gray',
  contrast = false,
  highContrast = false,
  size = '3',
  style,
  weight = 'regular',
}: Props) {
  const { styles } = useStyles(stylesheet)

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTText', {
    children,
    style: [
      styles.main({
        align,
        color,
        contrast,
        highContrast,
        size,
        weight,
      }),
      style,
    ],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: ({
    align,
    color,
    contrast,
    highContrast,
    size,
    weight,
  }: Required<
    Pick<
      Props,
      'align' | 'color' | 'contrast' | 'highContrast' | 'size' | 'weight'
    >
  >) => ({
    color:
      theme.colors[`${color}A`][contrast ? 'contrast' : highContrast ? 12 : 11],
    fontFamily: weight,
    fontSize: theme.typography[size].fontSize,
    fontWeight:
      weight === 'bold'
        ? '700'
        : weight === 'medium'
          ? '500'
          : weight === 'light'
            ? '300'
            : '400',
    lineHeight: theme.typography[size].lineHeight,
    textAlign: align,
  }),
}))
