import { createElement, type ReactNode } from 'react'
import { type StyleProp, type TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = ViewStyleProps & {
  children?: ReactNode
  style?: StyleProp<TextStyle>
}

export function View({ children, style, ...props }: Props) {
  const { styles } = useStyles(stylesheet)

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTView', {
    children,
    style: [styles.main(props), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
