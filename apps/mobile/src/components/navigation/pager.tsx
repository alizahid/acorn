import { BlurView } from 'expo-blur'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'

type Props = {
  active?: number
  items: Array<string>
}

export function PagerHeader({ active, items }: Props) {
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  return (
    <BlurView intensity={100} style={styles.main(insets.top)}>
      <View style={styles.header}>
        {items.map((item, index) => (
          <Text
            color={index === active ? 'accent' : 'gray'}
            key={item}
            style={styles.item}
            weight="bold"
          >
            {item}
          </Text>
        ))}
      </View>
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.space[8],
  },
  item: {
    paddingHorizontal: theme.space[4],
  },
  main: (inset: number) => ({
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
}))
