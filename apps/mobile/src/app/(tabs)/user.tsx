import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '~/components/common/text'

export default function Screen() {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Text>User</Text>
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
}))
