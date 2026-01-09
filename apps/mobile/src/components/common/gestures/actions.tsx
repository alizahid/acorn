import { type SFSymbol, SymbolView, type SymbolViewProps } from 'expo-symbols'
import { type ReactNode } from 'react'
import { type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

import { cardMaxWidth, iPad } from '~/lib/common'
import { triggerFeedback } from '~/lib/feedback'
import { getIcon } from '~/lib/icons'
import { type ColorToken } from '~/styles/tokens'
import { type Undefined } from '~/types'

import { type GestureAction, type GestureData, type Gestures } from '.'

const Icon = Animated.createAnimatedComponent(SymbolView)

type Props = {
  children: ReactNode
  data: GestureData
  gestures: {
    left: Gestures
    right: Gestures
  }
  onAction: (action: Undefined<GestureAction>) => void
  style?: ViewStyle
}

export function Actions({ children, data, gestures, onAction, style }: Props) {
  const frame = useSafeAreaFrame()

  const translate = useSharedValue(0)
  const height = useSharedValue(0)

  const { theme } = useUnistyles()

  const action = useSharedValue<GestureAction | null>(null)
  const color = useSharedValue(theme.colors.gray.accent)
  const icon = useSharedValue<SFSymbol>('questionmark')
  const opacity = useSharedValue(0)
  const scale = useSharedValue(1)

  const width = iPad
    ? style?.maxWidth
      ? Number(style.maxWidth)
      : cardMaxWidth
    : frame.width

  const active: number | [number, number] =
    gestures.left.enabled && gestures.right.enabled
      ? [-10, 10]
      : gestures.left.enabled
        ? 10
        : gestures.right.enabled
          ? -10
          : Number.POSITIVE_INFINITY

  const gesture = Gesture.Pan()
    .activeOffsetX(active)
    .hitSlop({
      left: -24,
      right: -24,
    })
    .onUpdate((event) => {
      if (
        (!gestures.left.enabled && event.translationX >= 0) ||
        (!gestures.right.enabled && event.translationX <= 0)
      ) {
        translate.set(0)

        return
      }

      const translationX = Math.abs(event.translationX)

      if (translationX >= width) {
        return
      }

      translate.set(event.translationX)

      const side = event.translationX > 0 ? 'left' : 'right'
      const swipe =
        translationX >= width * 0.4
          ? 'long'
          : translationX >= width * 0.2
            ? 'short'
            : null

      const gesture = gestures[side][swipe ?? 'short']

      if (swipe && gesture !== action.get()) {
        scale.set(
          withTiming(
            1.5,
            {
              duration: 100,
            },
            () => {
              scale.set(
                withTiming(1, {
                  duration: 100,
                }),
              )
            },
          ),
        )

        scheduleOnRN(triggerFeedback, 'soft')
      }

      color.set(theme.colors[GestureColors[gesture]].accent)
      icon.set(getNextIcon(gesture, data))

      action.set(swipe ? gesture : null)

      opacity.set(
        withTiming(swipe ? 1 : 0.5, {
          duration: 100,
        }),
      )
    })
    .onEnd(() => {
      translate.set(withTiming(0))

      const name = action.get()

      if (name) {
        scheduleOnRN(onAction, name)

        action.set(null)
      }

      setTimeout(() => {
        opacity.set(0)
      }, 250)
    })

  const left = useAnimatedStyle<ViewStyle>(() => {
    const x = translate.get()

    if (x <= 0) {
      return {
        opacity: 0,
      }
    }

    return {
      backgroundColor: color.get(),
      display: 'flex',
      height: height.get(),
      left: 0,
      opacity: 1,
      transform: [
        {
          scale: scale.get(),
        },
      ],
      width: Math.abs(x),
    }
  })

  const right = useAnimatedStyle<ViewStyle>(() => {
    const x = translate.get()

    if (x > 0) {
      return {
        opacity: 0,
      }
    }

    return {
      backgroundColor: color.get(),
      display: 'flex',
      height: height.get(),
      left: width + x,
      opacity: 1,
      transform: [
        {
          scale: scale.get(),
        },
      ],
      width: Math.abs(x),
    }
  })

  const child = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translate.get(),
      },
    ],
  }))

  const iconProps = useAnimatedProps<SymbolViewProps>(() => ({
    name: icon.get(),
  }))

  const iconStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style}>
        <Animated.View pointerEvents="none" style={[styles.action, left]}>
          <Icon
            animatedProps={iconProps}
            name="questionmark"
            size={32}
            style={iconStyle}
            tintColor="#fff"
          />
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.action, right]}>
          <Icon
            animatedProps={iconProps}
            name="questionmark"
            size={32}
            style={iconStyle}
            tintColor="#fff"
          />
        </Animated.View>

        <Animated.View
          onLayout={(event) => {
            height.set(event.nativeEvent.layout.height)
          }}
          style={child}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
  },
})

export const GestureColors = {
  downvote: 'violet',
  hide: 'red',
  reply: 'blue',
  save: 'green',
  share: 'accent',
  upvote: 'orange',
} as const satisfies Record<GestureAction, ColorToken>

export const GestureIcons = {
  downvote: getIcon('downvote'),
  hide: 'eye.slash',
  reply: 'arrowshape.turn.up.backward',
  save: 'bookmark',
  share: 'square.and.arrow.up',
  upvote: getIcon('upvote'),
} as const satisfies Record<GestureAction, SFSymbol>

function getNextIcon(action: GestureAction, data: GestureData): SFSymbol {
  'worklet'

  if (action === 'upvote') {
    return data.liked ? GestureIcons.upvote : `${GestureIcons.upvote}.fill`
  }

  if (action === 'downvote') {
    return data.liked === false
      ? GestureIcons.downvote
      : `${GestureIcons.downvote}.fill`
  }

  if (action === 'save') {
    return data.saved ? GestureIcons.save : `${GestureIcons.save}.fill`
  }

  if (action === 'hide') {
    return data.hidden ? GestureIcons.hide : `${GestureIcons.hide}.fill`
  }

  return `${GestureIcons[action]}.fill`
}
