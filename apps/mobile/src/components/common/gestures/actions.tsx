import { type SFSymbol } from 'expo-symbols'
import { useState } from 'react'
import { Platform, type StyleProp, type ViewStyle } from 'react-native'
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

  const [icon, setIcon] = useState<SFSymbol>(icons[short])

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

      const next = getIcon(nextAction ?? short, data)

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

export const colors: Record<GestureAction, ColorToken> = {
  downvote: 'violet',
  hide: 'red',
  reply: 'blue',
  save: 'green',
  share: 'accent',
  upvote: 'orange',
}

export const icons = {
  downvote: (Number(Platform.Version) >= 17) ? 'arrowshape.down' : 'arrow.down.circle',
  hide: 'eye.slash',
  reply: 'arrowshape.turn.up.backward',
  save: 'bookmark',
  share: 'square.and.arrow.up',
  upvote: (Number(Platform.Version) >= 17) ? 'arrowshape.up' : 'arrow.up.circle',
} as const satisfies Record<GestureAction, SFSymbol>

export function getIcon(action: GestureAction, data: GestureData): SFSymbol {
  'worklet'

  if (action === 'upvote') {
    return data.liked ? icons.upvote : `${icons.upvote}.fill`
  }

  if (action === 'downvote') {
    return data.liked === false ? icons.downvote : `${icons.downvote}.fill`
  }

  if (action === 'save') {
    return data.saved ? icons.save : `${icons.save}.fill`
  }

  if (action === 'hide') {
    return data.hidden ? icons.hide : `${icons.hide}.fill`
  }

  return `${icons[action]}.fill`
}
