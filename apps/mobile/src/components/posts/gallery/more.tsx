import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { Defs, Path, Pattern, Rect, Svg } from 'react-native-svg'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export function More() {
  const frame = useSafeAreaFrame()

  const { theme } = useUnistyles()

  const size = frame.width / 32

  return (
    <Svg height={size} pointerEvents="none" style={styles.main} width="100%">
      <Defs>
        <Pattern
          height={size}
          id="zigzag"
          patternUnits="userSpaceOnUse"
          width={size * 2}
        >
          <Path
            d={`M0 ${size} L${size} 0 L${size * 2} ${size} Z`}
            fill={theme.colors.ui.bg}
          />
        </Pattern>
      </Defs>

      <Rect fill="url(#zigzag)" height={size} width="100%" />
    </Svg>
  )
}

const styles = StyleSheet.create({
  main: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
})
