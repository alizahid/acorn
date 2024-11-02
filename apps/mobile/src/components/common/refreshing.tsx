import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from './spinner'

export function Refreshing() {
  const { styles } = useStyles(stylesheet)

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={SlideOutUp}
      pointerEvents="none"
      style={styles.main}
    >
      <Spinner contrast />
    </Animated.View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: {
    alignSelf: 'center',
    backgroundColor: theme.colors.accent.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
    padding: theme.space[2],
    position: 'absolute',
    top: runtime.insets.top + theme.space[9],
  },
}))
