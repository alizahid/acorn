import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export function MenuSeparator() {
  return <View style={styles.main} />
}

const styles = StyleSheet.create((theme) => ({
  main: {
    height: theme.space[4],
  },
}))
