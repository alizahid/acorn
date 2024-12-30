import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated'

import { iPhone } from '~/lib/common'

type Props = {
  enabled?: boolean
}

export function KeyboardHeight({ enabled = iPhone }: Props) {
  const keyboard = useAnimatedKeyboard()

  const style = useAnimatedStyle(() => ({
    height: enabled ? keyboard.height.get() : 0,
  }))

  return <Animated.View style={style} />
}
