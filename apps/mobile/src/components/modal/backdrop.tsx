import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react'
import { Pressable as ReactNativePressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const Pressable = Animated.createAnimatedComponent(ReactNativePressable)

export type Backdrop = {
  hide: () => void
  show: () => void
}

type Props = {
  onClose: () => void
  visible: boolean
}

export const Backdrop = forwardRef<Backdrop, Props>(function Component(
  { onClose, visible },
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

  const { styles } = useStyles(stylesheet)

  const opacity = useSharedValue(0)

  const onShow = useCallback(() => {
    opacity.value = withTiming(0.5, {
      duration: 250,
    })
  }, [opacity])

  const onHide = useCallback(() => {
    opacity.value = withTiming(0, {
      duration: 250,
    })
  }, [opacity])

  useEffect(() => {
    if (visible) {
      onShow()
    } else {
      onHide()
    }
  }, [onHide, onShow, visible])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Pressable
      disabled={!visible}
      onPress={onClose}
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.main, animatedStyle]}
    />
  )
})

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray[12],
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
}))
