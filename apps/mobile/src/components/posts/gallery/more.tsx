import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { Defs, Path, Pattern, Rect, Svg } from 'react-native-svg'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export function More() {
  const frame = useSafeAreaFrame()

  const { theme } = useUnistyles()

  const size = frame.width / 16
  const depth = size / 3

  return (
    <Svg height={depth} pointerEvents="none" style={styles.main} width="100%">
      <Defs>
        <Pattern
          height={depth}
          id="scallop"
          patternUnits="userSpaceOnUse"
          width={size}
        >
          <Path
            d={`M0 0 H${size / 4} A${size / 4} ${size / 4} 0 0 0 ${(size / 4) * 3} 0 H${size} V${depth} H0 Z`}
            fill={theme.colors.ui.bg}
          />
        </Pattern>
      </Defs>

      <Rect fill="url(#scallop)" height={depth} width="100%" />
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
