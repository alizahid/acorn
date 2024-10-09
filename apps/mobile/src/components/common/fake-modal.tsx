import { type ReactNode, useEffect } from 'react'
import { Modal, type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HeaderButton } from '../navigation/header-button'

type Props = {
  children: ReactNode
  close?: boolean
  footer?: ReactNode
  onClose: () => void
  style?: StyleProp<ViewStyle>
  visible: boolean
}

export function FakeModal({
  children,
  close,
  footer,
  onClose,
  style,
  visible,
}: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  const translate = useSharedValue(frame.height)

  useEffect(() => {
    if (visible) {
      translate.value = withTiming(0)
    }
  }, [translate, visible])

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translate.value = event.translationY
    })
    .onEnd((event) => {
      if (
        Math.abs(event.translationY) > 100 ||
        Math.abs(event.velocityY) > 1_000
      ) {
        translate.value = withTiming(
          event.translationY < 0 ? -frame.height : frame.height,
          undefined,
          () => {
            runOnJS(onClose)()

            translate.value = frame.height
          },
        )
      } else {
        translate.value = withTiming(0)
      }
    })

  const overlay = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        translate.value,
        [-frame.height, 0, frame.height],
        [0, 1, 0],
      ),
    }),
    [translate.value],
  )

  const controls = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        translate.value,
        [-(frame.height * 0.25), 0, frame.height * 0.25],
        [0, 1, 0],
      ),
    }),
    [translate.value],
  )

  const content = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translate.value,
      },
    ],
  }))

  return (
    <Modal transparent visible={visible}>
      <Animated.View pointerEvents="none" style={[styles.overlay, overlay]} />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.main, content, style]}>
          {children}
        </Animated.View>
      </GestureDetector>

      {close ? (
        <Animated.View style={[styles.close, controls]}>
          <HeaderButton
            icon="X"
            onPress={() => {
              translate.value = withTiming(frame.height, undefined, () => {
                runOnJS(onClose)()
              })
            }}
            weight="bold"
          />
        </Animated.View>
      ) : null}

      {footer ? (
        <Animated.View style={[styles.footer, controls]}>
          {footer}
        </Animated.View>
      ) : null}
    </Modal>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  close: {
    position: 'absolute',
    right: theme.space[4],
    top: theme.space[4] + runtime.insets.top,
  },
  footer: {
    bottom: theme.space[4] + runtime.insets.bottom,
    flexDirection: 'row',
    left: theme.space[4],
    position: 'absolute',
    right: theme.space[4],
  },
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray[1],
  },
}))
