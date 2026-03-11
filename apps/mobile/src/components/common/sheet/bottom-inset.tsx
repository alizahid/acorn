import { StyleSheet } from 'react-native-unistyles'

import { iPad } from '~/lib/common'

import { View } from '../view'

export function BottomInset() {
  return <View style={styles.main} />
}

const styles = StyleSheet.create((_theme, runtime) => ({
  main: {
    height: iPad ? runtime.insets.bottom : undefined,
  },
}))
