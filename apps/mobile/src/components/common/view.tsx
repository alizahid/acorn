import { createElement, type ReactNode } from 'react'
import {
  type LayoutChangeEvent,
  type StyleProp,
  type TextStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = ViewStyleProps & {
  children?: ReactNode
  onLayout?: (event: LayoutChangeEvent) => void
  responder?: boolean
  style?: StyleProp<TextStyle>
}

export function View({
  children,
  onLayout,
  responder,
  style,
  ...props
}: Props) {
  const { styles } = useStyles(stylesheet)

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTView', {
    children,
    onLayout,
    onStartShouldSetResponder: responder ? () => true : undefined,
    style: [styles.main(props), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
