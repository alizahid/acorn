import { BlurView } from 'expo-blur'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { SegmentedControl } from '../common/segmented-control'

type Props = {
  active?: number
  items: Array<string>
  onChange?: (index: number) => void
}

export function CommunitiesHeader({ active, items, onChange }: Props) {
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  return (
    <BlurView intensity={75} style={styles.main(insets.top)}>
      <View style={styles.header}>
        <SegmentedControl
          active={active}
          items={items}
          onChange={(index) => {
            onChange?.(index)
          }}
        />
      </View>
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    padding: theme.space[4],
  },
  main: (inset: number) => ({
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
}))
