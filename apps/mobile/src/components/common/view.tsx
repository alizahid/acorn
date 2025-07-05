import { createElement, type ReactNode } from 'react'
import {
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = ViewStyleProps & {
  children?: ReactNode
  collapsable?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
  pointerEvents?: ViewProps['pointerEvents']
  responder?: boolean
  style?: StyleProp<ViewStyle>
}

export function View({
  children,
  collapsable,
  onLayout,
  pointerEvents,
  responder,
  style,
  ...props
}: Props) {
  const { styles } = useStyles(stylesheet)

  return createElement('RCTView', {
    children,
    collapsable,
    onLayout,
    onStartShouldSetResponder: responder ? () => true : undefined,
    pointerEvents,
    style: [styles.main(props), style],
  })
}

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
