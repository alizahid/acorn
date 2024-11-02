import { useState } from 'react'
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '~/components/common/icon'
import { swipeActionThreshold } from '~/lib/common'

import { type GestureAction } from '.'

type Props = {
  action: SharedValue<GestureAction>
  liked: boolean | null
  progress: SharedValue<number>
}

export function Left({ action, liked, progress }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const [icon, setIcon] = useState<IconName>('ArrowUp')
  const [weight, setWeight] = useState<IconWeight>('duotone')

  const background = useAnimatedStyle(() => {
    const color =
      progress.get() > swipeActionThreshold.second ? 'violet' : 'orange'

    return {
      backgroundColor: theme.colors[color].a9,
    }
  })

  const foreground = useAnimatedStyle(() => ({
    opacity: progress.get() > swipeActionThreshold.first ? 1 : 0.25,
  }))

  useAnimatedReaction(
    () => progress.get(),
    (value) => {
      action.set(() =>
        value > swipeActionThreshold.second
          ? 'downvote'
          : value > swipeActionThreshold.first
            ? 'upvote'
            : undefined,
      )

      const nextIcon =
        value > swipeActionThreshold.second ? 'ArrowFatDown' : 'ArrowFatUp'

      if (icon !== nextIcon) {
        runOnJS(setIcon)(nextIcon)
      }

      const nextWeight =
        value > swipeActionThreshold.second
          ? liked === false
            ? 'regular'
            : 'fill'
          : liked
            ? 'regular'
            : 'fill'

      if (weight !== nextWeight) {
        runOnJS(setWeight)(nextWeight)
      }
    },
  )

  return (
    <Animated.View style={[styles.main, background]}>
      <Animated.View style={foreground}>
        <Icon
          color={theme.colors.accent.contrast}
          name={icon}
          size={theme.space[6]}
          weight={weight}
        />
      </Animated.View>
    </Animated.View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.space[4],
    width: '90%',
  },
}))
