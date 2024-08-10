import * as StatusBar from 'expo-status-bar'
import { type ReactNode, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  children: ReactNode
}

export function Zoom({ children }: Props) {
  const [hidden, setHidden] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  })

  const scale = useSharedValue(1)
  const previousScale = useSharedValue(1)

  const focal = { x: useSharedValue(0), y: useSharedValue(0) }
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) }
  const previousFocal = { x: useSharedValue(0), y: useSharedValue(0) }

  const translate = { x: useSharedValue(0), y: useSharedValue(0) }
  const previousTranslate = { x: useSharedValue(0), y: useSharedValue(0) }

  function reset() {
    'worklet'

    previousScale.value = 1
    scale.value = withTiming(1)

    initialFocal.x.value = 0
    initialFocal.y.value = 0

    previousFocal.x.value = 0
    previousFocal.y.value = 0

    focal.x.value = withTiming(0)
    focal.y.value = withTiming(0)

    previousTranslate.x.value = 0
    previousTranslate.y.value = 0

    translate.x.value = withTiming(0)
    translate.y.value = withTiming(0)

    runOnJS(setZoomed)(false)
  }

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd((event) => {
      scale.value = withTiming(zoomed ? 1 : 3)

      focal.x.value = withTiming(zoomed ? 1 : (dimensions.x - event.x) * 2)
      focal.y.value = withTiming(zoomed ? 1 : (dimensions.y - event.y) * 2)

      if (zoomed) {
        reset()
      }

      runOnJS(setZoomed)(!zoomed)
    })

  const singleTap = Gesture.Tap()
    .requireExternalGestureToFail(doubleTap)
    .onEnd(() => {
      runOnJS(StatusBar.setStatusBarHidden)(!hidden, 'fade')

      runOnJS(setHidden)(!hidden)
    })

  const pinch = Gesture.Pinch()
    .onStart((event) => {
      previousScale.value = scale.value
      previousFocal.x.value = focal.x.value
      previousFocal.y.value = focal.y.value

      initialFocal.x.value = event.focalX
      initialFocal.y.value = event.focalY
    })
    .onUpdate((event) => {
      scale.value = clamp(previousScale.value * event.scale, 0, 5)

      focal.x.value =
        previousFocal.x.value +
        (dimensions.x - initialFocal.x.value) *
          (scale.value - previousScale.value)

      focal.y.value =
        previousFocal.y.value +
        (dimensions.y - initialFocal.y.value) *
          (scale.value - previousScale.value)
    })
    .onEnd((event) => {
      if (event.scale > 4) {
        scale.value = withTiming(3)
      }

      if (event.scale > 1) {
        runOnJS(setZoomed)(true)
      } else {
        reset()
      }
    })

  const pan = Gesture.Pan()
    .enabled(zoomed)
    .onStart(() => {
      previousTranslate.x.value = translate.x.value
      previousTranslate.y.value = translate.y.value
    })
    .onUpdate((event) => {
      translate.x.value = previousTranslate.x.value + event.translationX
      translate.y.value = previousTranslate.y.value + event.translationY
    })
    .onEnd((event) => {
      if (scale.value > 1) {
        const x = (dimensions.width * (scale.value - 1)) / 2
        const y = (dimensions.height * (scale.value - 1)) / 2

        translate.x.value = withDecay({
          clamp: [-x - focal.x.value, x - focal.x.value],
          rubberBandEffect: true,
          rubberBandFactor: 0.9,
          velocity: event.velocityX,
          velocityFactor: 0.6,
        })

        translate.y.value = withDecay({
          clamp: [-y - focal.y.value, y - focal.y.value],
          rubberBandEffect: true,
          rubberBandFactor: 0.9,
          velocity: event.velocityY,
          velocityFactor: 0.6,
        })
      }
    })

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translate.x.value,
      },
      {
        translateY: translate.y.value,
      },
      {
        translateX: focal.x.value,
      },
      {
        translateY: focal.y.value,
      },
      {
        scale: scale.value,
      },
    ],
  }))

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(singleTap, doubleTap, pinch, pan)}
    >
      <Animated.View
        onLayout={(event) => {
          const layout = event.nativeEvent.layout

          setDimensions({
            height: layout.height,
            width: layout.width,
            x: layout.x + layout.width / 2,
            y: layout.y + layout.height / 2,
          })
        }}
        style={style}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
