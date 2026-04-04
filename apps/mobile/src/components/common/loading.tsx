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

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginVertical: theme.space[9],
  },
}))
