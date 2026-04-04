import { type ReactNode } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

export function MenuRoot({ children, style }: Props) {
  return <View style={[styles.main, style]}>{children}</View>
}

const styles = StyleSheet.create((theme) => ({
  main: {
    paddingVertical: theme.space[1],
  },
}))
