import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export function More() {
  return <View style={styles.main} />
}

const styles = StyleSheet.create((theme) => ({
  main: {
    bottom: 0,
    experimental_backgroundImage: 'linear-gradient(transparent, black)',
    height: theme.space[9],
    left: 0,
    position: 'absolute',
    right: 0,
  },
}))
