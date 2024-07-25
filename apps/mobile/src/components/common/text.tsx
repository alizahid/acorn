import { createElement, type ReactNode } from 'react'
import { type StyleProp, type TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getTextStyles, type TextStyleProps } from '~/styles/text'

type Props = TextStyleProps & {
  children: ReactNode
  style?: StyleProp<TextStyle>
}

export function Text({
  align,
  children,
  color,
  contrast,
  highContrast,
  size,
  style,
  weight,
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
  main: getTextStyles(theme),
}))
