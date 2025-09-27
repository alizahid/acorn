import { type SFSymbol } from 'expo-symbols'
import { useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { swipeActionThreshold } from '~/lib/common'
import { triggerFeedback } from '~/lib/feedback'
import { getIcon } from '~/lib/icons'
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

  const [icon, setIcon] = useState<SFSymbol>(GestureIcons[short])

  const background = useAnimatedStyle(() => {
    const color =
      GestureColors[progress.get() > swipeActionThreshold.long ? long : short]

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

      const next = getNextIcon(nextAction ?? short, data)

      if (next !== icon) {
        runOnJS(setIcon)(next)
      }
    },
  )

  return (
    <Animated.View style={[style, background]}>
      <Animated.View style={foreground}>
        <Icon
          name={icon}
          uniProps={($theme) => ({
            size: $theme.space[6],
            tintColor: $theme.colors.accent.contrast,
          })}
        />
      </Animated.View>
    </Animated.View>
  )
}

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
