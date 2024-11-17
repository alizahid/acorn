import { createElement, forwardRef, type ReactNode } from 'react'
import {
  type LayoutChangeEvent,
  type StyleProp,
  type View as ReactNativeView,
  type ViewProps,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = ViewStyleProps & {
  children?: ReactNode
  onLayout?: (event: LayoutChangeEvent) => void
  pointerEvents?: ViewProps['pointerEvents']
  responder?: boolean
  style?: StyleProp<ViewStyle>
}

export const View = forwardRef<ReactNativeView, Props>(function View(
  { children, onLayout, pointerEvents, responder, style, ...props },
  ref,
) {
  const { styles } = useStyles(stylesheet)

  // eslint-disable-next-line react/no-children-prop -- go away
  return createElement('RCTView', {
    children,
    onLayout,
    onStartShouldSetResponder: responder ? () => true : undefined,
    pointerEvents,
    ref,
    style: [styles.main(props), style],
  })
})

const stylesheet = createStyleSheet((theme) => ({
  main: getViewStyles(theme),
}))
