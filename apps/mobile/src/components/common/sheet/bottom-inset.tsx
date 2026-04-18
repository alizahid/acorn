import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export function BottomInset() {
  return <View style={styles.main} />
}

const styles = StyleSheet.create((_theme, runtime) => ({
  main: {
    height: runtime.insets.bottom,
  },
}))
