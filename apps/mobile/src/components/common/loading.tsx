import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Spinner } from './spinner'

type Props = {
  style?: StyleProp<ViewStyle>
}

export function Loading({ style }: Props) {
  return (
    <View style={[styles.main, style]}>
      <Spinner size="large" />
    </View>
  )
}

const styles = StyleSheet.create((_theme, runtime) => ({
  main: {
    alignItems: 'center',
    height: runtime.screen.height * 0.6,
    justifyContent: 'center',
  },
}))
