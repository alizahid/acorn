import Animated, {
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

import { Header, type HeaderProps } from './header'

type Props = HeaderProps & {
  visible: SharedValue<boolean>
}

export function StickyHeader({ visible, ...props }: Props) {
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(visible.get() ? 0 : -200),
      },
    ],
    zIndex: 1000,
  }))

  return (
    <Animated.View style={style}>
      <Header {...props} />
    </Animated.View>
  )
}
