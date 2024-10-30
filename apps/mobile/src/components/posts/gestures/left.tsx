import { useState } from 'react'
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '~/components/common/icon'
import { type Post } from '~/types/post'

export type Action = 'upvote' | 'downvote' | 'save' | 'reply' | undefined

type Props = {
  action: SharedValue<Action>
  post: Post
  progress: SharedValue<number>
}

export function Left({ action, post, progress }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const [icon, setIcon] = useState<IconName>('ArrowUp')
  const [weight, setWeight] = useState<IconWeight>('duotone')

  const width = useDerivedValue(() => styles.slot.width * progress.get())

  const background = useAnimatedStyle(() => ({
    backgroundColor: theme.colors[width.get() > 144 ? 'violet' : 'orange'].a9,
  }))

  const foreground = useAnimatedStyle(() => ({
    opacity: width.get() > 72 ? 1 : 0.25,
  }))

  useAnimatedReaction(
    () => ({
      liked: post.liked,
      width: width.get(),
    }),
    (value) => {
      action.set(
        value.width > 144
          ? 'downvote'
          : value.width > 72
            ? 'upvote'
            : undefined,
      )

      runOnJS(setIcon)(value.width > 144 ? 'ArrowFatDown' : 'ArrowFatUp')
      runOnJS(setWeight)(
        value.width > 144
          ? value.liked === false
            ? 'duotone'
            : 'fill'
          : value.liked
            ? 'duotone'
            : 'fill',
      )
    },
    [width, post.liked],
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
    justifyContent: 'center',
    padding: theme.space[4],
    width: runtime.screen.width - theme.space[4],
  },
}))
