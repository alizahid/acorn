import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Credentials } from '~/components/auth/credentials'
import { useFrame } from '~/hooks/frame'

export default function Screen() {
  const frame = useFrame()

  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main(frame.padding.top, frame.padding.bottom)}>
      <Credentials />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (top: number, bottom: number) => ({
    backgroundColor: theme.colors.gray[1],
    flex: 1,
    paddingBottom: bottom + theme.space[4],
    paddingHorizontal: theme.space[4],
    paddingTop: top + theme.space[4],
  }),
}))
