import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from './spinner'

export type RefreshingProps = {
  header?: boolean
  inset?: boolean
  offset?: number
}

export function Refreshing(props: RefreshingProps) {
  const { styles } = useStyles(stylesheet)

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={SlideOutUp}
      pointerEvents="none"
      style={styles.main(props)}
    >
      <Spinner contrast />
    </Animated.View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: ({ header = true, inset = true, offset = 0 }: RefreshingProps) => ({
    alignSelf: 'center',
    backgroundColor: theme.colors.accent.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[6],
    padding: theme.space[3],
    position: 'absolute',
    top:
      (inset ? runtime.insets.top : 0) +
      (header ? theme.space[8] : 0) +
      theme.space[9] +
      offset,
  }),
}))
