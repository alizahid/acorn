import { useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '~/components/common/icon'
import { swipeActionThreshold } from '~/lib/common'
import { triggerFeedback } from '~/lib/feedback'
import { type ColorToken } from '~/styles/tokens'
import { type Undefined } from '~/types'

import { type GestureAction, type GestureData } from '.'

type Props = {
  action: SharedValue<Undefined<GestureAction>>
  data: GestureData
  long: GestureAction
  progress: SharedValue<number>
  short: GestureAction
  style: StyleProp<ViewStyle>
}

export function Actions({ action, data, long, progress, short, style }: Props) {
  const { theme } = useUnistyles()

  const [icon, setIcon] = useState<IconName>(icons[short])
  const [weight, setWeight] = useState<IconWeight>('fill')

  const background = useAnimatedStyle(() => {
    const color =
      colors[progress.get() > swipeActionThreshold.long ? long : short]

    return {
      backgroundColor: theme.colors[color].accent,
    }
  })

  const foreground = useAnimatedStyle(() => ({
    opacity: progress.get() > swipeActionThreshold.short ? 1 : 0.25,
  }))

  useAnimatedReaction(
    () => progress.get(),
    (value) => {
      const nextAction =
        value > swipeActionThreshold.long
          ? long
          : value > swipeActionThreshold.short
            ? short
            : undefined

      if (nextAction && nextAction !== action.get()) {
        runOnJS(triggerFeedback)('soft')
      }

      action.set(() => nextAction)

      const nextIcon = nextAction ? icons[nextAction] : null

      if (nextIcon && nextIcon !== icon) {
        runOnJS(setIcon)(nextIcon)
      }

      const nextWeight = getWeight(nextAction ?? short, data)

      if (nextWeight !== weight) {
        runOnJS(setWeight)(nextWeight)
      }
    },
  )

  return (
    <Animated.View style={[style, background]}>
      <Animated.View style={foreground}>
        <Icon
          name={icon}
          uniProps={($theme) => ({
            color: $theme.colors.accent.contrast,
            size: $theme.space[6],
          })}
          weight={weight}
        />
      </Animated.View>
    </Animated.View>
  )
}

export const colors: Record<GestureAction, ColorToken> = {
  downvote: 'violet',
  hide: 'red',
  reply: 'blue',
  save: 'green',
  share: 'accent',
  upvote: 'orange',
}

export const icons: Record<GestureAction, IconName> = {
  downvote: 'ArrowFatDown',
  hide: 'EyeClosed',
  reply: 'ArrowBendUpLeft',
  save: 'BookmarkSimple',
  share: 'Share',
  upvote: 'ArrowFatUp',
}

export function getWeight(
  action: GestureAction,
  data: GestureData,
): IconWeight {
  'worklet'

  if (action === 'upvote' && data.liked) {
    return 'regular'
  }

  if (action === 'downvote' && data.liked === false) {
    return 'regular'
  }

  if (action === 'save' && data.saved) {
    return 'regular'
  }

  if (action === 'hide' && data.hidden) {
    return 'regular'
  }

  return 'fill'
}
