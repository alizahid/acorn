import MaskedView from '@react-native-masked-view/masked-view'
import { useState } from 'react'
import { Animated, type ViewStyle } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { Pressable } from './pressable'
import { Text } from './text'
import { View } from './view'

type Props = {
  items: Array<string>
  offset: Animated.AnimatedInterpolation<number>
  onChange: (index: number) => void
}

export function SegmentedControl({ items, offset, onChange }: Props) {
  const { theme } = useUnistyles()

  const [width, setWidth] = useState(0)

  const style: ViewStyle = {
    transform: [
      {
        translateX: offset.interpolate({
          inputRange: items.map((_item, index) => index),
          outputRange: items.map(
            (_item, index) => index * width + theme.space[1] / 2,
          ),
        }),
      },
    ],
  }

  return (
    <View
      direction="row"
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
          flex={1}
          height="7"
          justify="center"
          key={item}
          label={item}
          onPress={() => {
            onChange(index)
          }}
          px="2"
          role="tab"
        >
          <Text highContrast={false} size="2" weight="bold">
            {item}
          </Text>
        </Pressable>
      ))}

      <MaskedView
        maskElement={
          <View direction="row">
            {items.map((item) => (
              <View
                align="center"
                flex={1}
                height="7"
                justify="center"
                key={item}
                px="2"
              >
                <Text color="blue" size="2" weight="bold">
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

const styles = StyleSheet.create((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.uiAlpha,
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
    backgroundColor: theme.colors.accent.accent,
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
