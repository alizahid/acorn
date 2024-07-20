import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  type AnimationCallback,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useKeyboard } from '~/hooks/keyboard'

import { Text } from '../common/text'

export type Content = {
  hide: () => void
  show: () => void
}

type Props = {
  children: ReactNode
  inset?: boolean
  onClose: () => void
  style?: StyleProp<ViewStyle>
  title?: string
  visible: boolean
}

export const Content = forwardRef<Content, Props>(function Component(
  { children, inset, onClose, style, title, visible },
  ref,
) {
  useImperativeHandle(ref, () => ({
    hide() {
      onHide()
    },
    show() {
      onShow()
    },
  }))

  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  const translate = useSharedValue(frame.height)

  const onShow = useCallback(
    (callback?: AnimationCallback) => {
      translate.value = withTiming(
        0,
        {
          duration: 250,
        },
        callback,
      )
    },
    [translate],
  )

  const onHide = useCallback(
    (callback?: AnimationCallback) => {
      translate.value = withTiming(
        frame.height,
        {
          duration: 250,
        },
        callback,
      )
    },
    [frame.height, translate],
  )

  const [height, setHeight] = useState(0)

  const keyboard = useKeyboard()

  useEffect(() => {
    if (visible) {
      onShow()
    } else {
      onHide()
    }
  }, [onHide, onShow, visible])

  const threshold = height * 0.3

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translate.value = event.translationY > 0 ? event.translationY : 0
    })
    .onEnd((event) => {
      if (event.translationY > threshold) {
        translate.value = withTiming(
          frame.height,
          {
            duration: 250,
          },
          () => {
            runOnJS(onClose)()
          },
        )
      } else {
        translate.value = withTiming(0, {
          duration: 250,
        })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translate.value,
      },
    ],
  }))

  return (
    <Animated.View
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height)
      }}
      style={[
        styles.main(
          frame.height - insets.top,
          inset && !keyboard.visible ? insets.bottom : 0,
        ),
        style,
        animatedStyle,
      ]}
    >
      <GestureDetector gesture={gesture}>
        <View
          hitSlop={{
            top: 50,
          }}
        >
          <View style={styles.handle} />

          {title ? (
            <View style={styles.header}>
              <Text align="center" highContrast weight="bold">
                {title}
              </Text>
            </View>
          ) : null}
        </View>
      </GestureDetector>

      {children}
    </Animated.View>
  )
})

const stylesheet = createStyleSheet((theme) => ({
  handle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray[1],
    borderRadius: theme.space[1],
    height: 6,
    position: 'absolute',
    top: -12,
    width: 64,
  },
  header: {
    borderBottomColor: theme.colors.grayA[6],
    borderBottomWidth: 1,
    height: theme.space[8],
    justifyContent: 'center',
  },
  main: (maxHeight: number, paddingBottom: number) => ({
    backgroundColor: theme.colors.gray[1],
    borderTopLeftRadius: theme.radius[5],
    borderTopRightRadius: theme.radius[5],
    bottom: 0,
    left: 0,
    maxHeight: maxHeight - theme.space[8],
    paddingBottom,
    position: 'absolute',
    right: 0,
    width: '100%',
  }),
}))
