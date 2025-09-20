import { View as Component, type ViewProps } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { stripProps } from '~/lib/styles'
import { type MarginProps, type PaddingProps } from '~/styles/space'
import { getViewStyles, type ViewStyleProps } from '~/styles/view'

type Props = ViewProps & ViewStyleProps & MarginProps & PaddingProps

export function View({ children, style, ...props }: Props) {
  return (
    <Component {...stripProps(props)} style={[styles.main(props), style]}>
      {children}
    </Component>
  )
}

const styles = StyleSheet.create({
  main: getViewStyles,
})
