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
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'

import { HeaderButton } from '../navigation/header-button'

type Props = {
  children: ReactNode
  close?: boolean
  onClose: () => void
  style?: StyleProp<ViewStyle>
  visible: boolean
}

export function FakeModal({ children, close, onClose, style, visible }: Props) {
  const common = useCommon()

  const { styles, theme } = useStyles(stylesheet)

  const translate = useSharedValue(common.frame.height)

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
      if (Math.abs(event.translationY) > 100) {
        translate.value = withTiming(
          event.translationY < 0 ? -common.frame.height : common.frame.height,
          undefined,
          () => {
            runOnJS(onClose)()
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
        [-common.frame.height, 0, common.frame.height],
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
        <Animated.View
          collapsable={false}
          style={[styles.main, content, style]}
        >
          {children}
        </Animated.View>
      </GestureDetector>

      {close ? (
        <Animated.View style={[styles.close(common.insets.top), overlay]}>
          <HeaderButton
            icon="X"
            onPress={() => {
              translate.value = withTiming(
                common.frame.height,
                undefined,
                () => {
                  runOnJS(onClose)()
                },
              )
            }}
            size={theme.space[6]}
            weight="bold"
          />
        </Animated.View>
      ) : null}
    </Modal>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  close: (inset: number) => ({
    position: 'absolute',
    right: theme.space[4],
    top: inset + theme.space[4],
  }),
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray[1],
  },
}))
