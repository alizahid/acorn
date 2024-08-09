import { BlurView } from 'expo-blur'
import { sum } from 'lodash'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  active?: number
  items: Array<string>
  onChange?: (index: number) => void
}

export function PagerHeader({ active, items, onChange }: Props) {
  const insets = useSafeAreaInsets()

  const widths = useRef<Map<number, number>>(new Map())

  const translate = useSharedValue(0)
  const width = useSharedValue(0)

  const { styles, theme } = useStyles(stylesheet)

  useEffect(() => {
    if (typeof active !== 'number') {
      return
    }

    const nextWidth = widths.current.get(active)

    const nextTranslate = sum(
      Array.from(widths.current.values()).slice(0, active),
    )

    if (!nextWidth) {
      return
    }

    translate.value = withTiming(nextTranslate)
    width.value = withTiming(nextWidth)
  }, [active, translate, width])

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translate.value,
      },
    ],
    width: width.value,
  }))

  return (
    <BlurView intensity={75} style={styles.main(insets.top)}>
      <View style={styles.header}>
        <View style={styles.items}>
          <Animated.View style={[styles.active, style]} />

          {items.map((item, index) => (
            <Pressable
              hitSlop={{
                bottom: theme.space[2],
                top: theme.space[2],
              }}
              key={item}
              onLayout={(event) => {
                widths.current.set(index, event.nativeEvent.layout.width)

                if (index === 0) {
                  width.value = event.nativeEvent.layout.width
                }
              }}
              onPress={() => {
                onChange?.(index)
              }}
              style={styles.item}
            >
              <Text
                color={index === active ? 'accent' : 'gray'}
                contrast
                size="2"
                weight="medium"
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  active: {
    backgroundColor: theme.colors.accent.a9,
    borderRadius: theme.radius[3],
    height: theme.space[6],
    position: 'absolute',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.space[4],
  },
  item: {
    height: theme.space[6],
    justifyContent: 'center',
    paddingHorizontal: theme.space[3],
  },
  items: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[3],
    flexDirection: 'row',
    overflow: 'hidden',
  },
  main: (inset: number) => ({
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
}))
