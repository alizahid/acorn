import { useEffect } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

type Props = {
  style?: StyleProp<ViewStyle>
}

export function Skeleton({ style }: Props) {
  const opacity = useSharedValue(0.5)

  const { styles } = useStyles(stylesheet)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1_000,
      }),
      -1,
      true,
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return <Animated.View style={[styles.main, animatedStyle, style]} />
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.grayA[5],
    borderRadius: theme.radius[2],
  },
}))
