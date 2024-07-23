import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '~/components/common/text'

export default function Screen() {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Text>Hello</Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray[1],
    flex: 1,
    justifyContent: 'center',
  },
}))
