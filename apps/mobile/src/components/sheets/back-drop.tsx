import {
  type BottomSheetBackdropProps,
  useBottomSheet,
} from '@gorhom/bottom-sheet'
import { StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

type Props = BottomSheetBackdropProps

export function SheetBackDrop({ animatedIndex }: Props) {
  const { styles } = useStyles(stylesheet)

  const { close } = useBottomSheet()

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.get(), [-1, 0], [0, 1]),
  }))

  const gesture = Gesture.Tap().onEnd(() => {
    runOnJS(close)()
  })

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.main, style]} />
    </GestureDetector>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray.a6,
  },
}))
