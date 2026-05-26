import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  style?: StyleProp<ViewStyle>
}

export function Separator({ style }: Props) {
  return <View style={[styles.main, style]} />
}

const styles = StyleSheet.create((theme) => ({
  main: {
    height: theme.space[4],
  },
}))
