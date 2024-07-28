import { createElement, type ReactNode } from 'react'
import { type StyleProp, type TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getTextStyles, type TextStyleProps } from '~/styles/text'

type Props = TextStyleProps & {
  children: ReactNode
  lines?: number
  selectable?: boolean
  style?: StyleProp<TextStyle>
}

export function Text({ children, lines, selectable, style, ...props }: Props) {
  const { styles } = useStyles(stylesheet)

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTText', {
    children,
    numberOfLines: lines,
    selectable,
    style: [styles.main(props), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getTextStyles(theme),
}))
