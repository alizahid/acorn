import { createElement, type ReactNode } from 'react'
import { type StyleProp, type TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getTextStyles, type TextStyleProps } from '~/styles/text'

type Props = TextStyleProps & {
  children: ReactNode
  lines?: number
  style?: StyleProp<TextStyle>
}

export function Text({
  align,
  children,
  color,
  contrast,
  highContrast,
  lines,
  size,
  style,
  tabular,
  weight,
}: Props) {
  const { styles } = useStyles(stylesheet)

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTText', {
    children,
    numberOfLines: lines,
    style: [
      styles.main({
        align,
        color,
        contrast,
        highContrast,
        size,
        tabular,
        weight,
      }),
      style,
    ],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
