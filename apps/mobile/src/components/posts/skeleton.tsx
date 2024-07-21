import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Skeleton } from '../common/skeleton'

export function PostSkeleton() {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  return <Skeleton style={styles.main(frame.width)} />
}

const stylesheet = createStyleSheet({
  main: (width: number) => ({
    height: width,
    width,
  }),
})
