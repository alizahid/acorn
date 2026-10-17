import { View } from 'react-native'
import { Defs, Path, Pattern, Rect, Svg } from 'react-native-svg'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { usePreferences } from '~/stores/preferences'

export function More() {
  const { perforatedCutoff } = usePreferences(
    useShallow((state) => ({
      perforatedCutoff: state.perforatedCutoff,
    })),
  )

  if (perforatedCutoff) {
    return (
      <Svg
        height={styles.perforated.height}
        pointerEvents="none"
        style={styles.main}
        width="100%"
      >
        <Defs>
          <Pattern
            height={styles.perforated.height}
            id="scallop"
            patternUnits="userSpaceOnUse"
            width={styles.perforated.width}
          >
            <Path
              d={`M0 0 H${styles.perforated.width / 4} A${styles.perforated.width / 4} ${styles.perforated.width / 4} 0 0 0 ${(styles.perforated.width / 4) * 3} 0 H${styles.perforated.width} V${styles.perforated.height} H0 Z`}
              fill={styles.perforated.backgroundColor}
            />
          </Pattern>
        </Defs>

        <Rect
          fill="url(#scallop)"
          height={styles.perforated.height}
          width="100%"
        />
      </Svg>
    )
  }

  return <View pointerEvents="none" style={[styles.main, styles.blur]} />
}

const styles = StyleSheet.create((theme, runtime) => ({
  blur: {
    backgroundImage: `linear-gradient(transparent, ${theme.colors.ui.bg})`,
    height: theme.space[6],
  },
  main: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  perforated: {
    backgroundColor: theme.colors.ui.bg,
    height: (runtime.screen.width - runtime.insets.right) / 12 / 3,
    width: (runtime.screen.width - runtime.insets.right) / 12,
  },
}))
