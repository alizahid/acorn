import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from './pressable'
import { Text } from './text'
import { View } from './view'

type Props = {
  items: Array<string>
  offset: SharedValue<number>
  onChange: (index: number) => void
}

export function SegmentedControl({ items, offset, onChange }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const width = styles.item(items.length).width

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: offset.value * width + theme.space[1] / 2,
      },
    ],
  }))

  return (
    <View direction="row" m="4" style={styles.main}>
      <Animated.View style={[styles.selected(width), animatedStyle]} />

      {items.map((item, index) => (
        <Pressable
          align="center"
          flexBasis={1}
          flexGrow={1}
          key={item}
          onPress={() => {
            onChange(index)
          }}
          p="2"
        >
          <Text size="2" weight="medium">
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  item: (items: number) => ({
    width: (runtime.screen.width - theme.space[6] - theme.space[1]) / items,
  }),
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
  selected: (width: number) => ({
    backgroundColor: theme.colors.accent.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
    bottom: theme.space[1] / 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: theme.space[1] / 2,
    width,
  }),
}))
