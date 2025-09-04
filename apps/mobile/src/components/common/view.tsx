import { type ReactNode, type Ref } from 'react'
import {
  View as Component,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { getViewStyles, type ViewStyleProps } from '~/styles/view'

export type View = Component

type Props = ViewStyleProps & {
  children?: ReactNode
  collapsable?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
  pointerEvents?: ViewProps['pointerEvents']
  ref?: Ref<Component>
  responder?: boolean
  style?: StyleProp<ViewStyle>
}

export function View({
  children,
  collapsable,
  onLayout,
  pointerEvents,
  ref,
  responder,
  style,
  ...props
}: Props) {
  return (
    <Component
      collapsable={collapsable}
      onLayout={onLayout}
      onStartShouldSetResponder={responder ? () => true : undefined}
      pointerEvents={pointerEvents}
      ref={ref}
      style={[styles.main(props), style]}
    >
      {children}
    </Component>
  )
}

const styles = StyleSheet.create({
  main: getViewStyles,
})
