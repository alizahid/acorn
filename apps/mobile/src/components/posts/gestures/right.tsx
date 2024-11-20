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
  progress: SharedValue<number>
  saved: boolean
}

export function Right({ action, progress, saved }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const [icon, setIcon] = useState<IconName>('ArrowBendUpLeft')
  const [weight, setWeight] = useState<IconWeight>('fill')

  const background = useAnimatedStyle(() => {
    const color =
      progress.get() > swipeActionThreshold.second ? 'green' : 'blue'

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
          ? 'save'
          : value > swipeActionThreshold.first
            ? 'reply'
            : undefined,
      )

      const nextIcon =
        value > swipeActionThreshold.second
          ? 'BookmarkSimple'
          : 'ArrowBendUpLeft'

      if (nextIcon !== icon) {
        runOnJS(setIcon)(nextIcon)
      }

      const nextWeight =
        value > swipeActionThreshold.second
          ? saved
            ? 'regular'
            : 'fill'
          : 'fill'

      if (nextWeight !== weight) {
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: theme.space[4],
    width: '90%',
  },
}))
