import MaskedView from '@react-native-masked-view/masked-view'
import { useState } from 'react'
import { Animated, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from './pressable'
import { Text } from './text'
import { View } from './view'

type Props = {
  items: Array<string>
  offset: Animated.AnimatedInterpolation<number>
  onChange: (index: number) => void
}

export function SegmentedControl({ items, offset, onChange }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const [width, setWidth] = useState(0)

  const style: ViewStyle = {
    transform: [
      {
        translateX: offset.interpolate({
          inputRange: items.map((item, index) => index),
          outputRange: items.map(
            (item, index) => index * width + theme.space[1] / 2,
          ),
        }),
      },
    ],
  }

  return (
    <View
      direction="row"
      key={String(items.length)}
      onLayout={(event) => {
        setWidth(
          (event.nativeEvent.layout.width - theme.space[1]) / items.length,
        )
      }}
      style={styles.main}
    >
      <Animated.View style={[styles.selected(width), style]} />

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
          <Text highContrast={false} size="2" weight="medium">
            {item}
          </Text>
        </Pressable>
      ))}

      <MaskedView
        maskElement={
          <View direction="row">
            {items.map((item) => (
              <View align="center" flexBasis={1} flexGrow={1} key={item} p="2">
                <Text color="blue" size="2" weight="medium">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        }
        pointerEvents="none"
        style={{
          height: '100%',
          position: 'absolute',
          width: '100%',
        }}
      >
        <Animated.View style={[styles.mask(width), style]} />
      </MaskedView>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
  mask: (width: number) => ({
    backgroundColor: theme.colors.accent.contrast,
    bottom: theme.space[1] / 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: theme.space[1] / 2,
    width,
  }),
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
