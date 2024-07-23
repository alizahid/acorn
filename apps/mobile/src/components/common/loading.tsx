import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from './spinner'

export function Loading() {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Spinner size="large" />
    </View>
  )
}

const stylesheet = createStyleSheet({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
