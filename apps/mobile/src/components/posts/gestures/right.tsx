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
import { type Post } from '~/types/post'

export type Action = 'upvote' | 'downvote' | 'save' | 'reply' | undefined

type Props = {
  action: SharedValue<Action>
  post: Post
  progress: SharedValue<number>
}

export function Right({ action, post, progress }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const [icon, setIcon] = useState<IconName>('ArrowUp')
  const [weight, setWeight] = useState<IconWeight>('fill')

  const background = useAnimatedStyle(() => ({
    backgroundColor:
      theme.colors[
        progress.get() > swipeActionThreshold.second ? 'green' : 'blue'
      ].a9,
  }))

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

      if (icon !== nextIcon) {
        runOnJS(setIcon)(nextIcon)
      }

      const nextWeight =
        value > swipeActionThreshold.second
          ? post.saved
            ? 'regular'
            : 'fill'
          : 'fill'

      if (weight !== nextWeight) {
        runOnJS(setWeight)(nextWeight)
      }
    },
  )

  return (
    <Animated.View style={[styles.slot, background]}>
      <Animated.View style={foreground}>
        <Icon
          color={theme.colors.accent.contrast}
          name={icon}
          size={theme.space[8]}
          weight={weight}
        />
      </Animated.View>
    </Animated.View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  slot: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: theme.space[4],
    width: runtime.screen.width - theme.space[4],
  },
}))
