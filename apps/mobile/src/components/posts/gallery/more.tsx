import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { maxWidth } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'

export function More() {
  const { perforatedCutoff } = usePreferences(
    useShallow((state) => ({
      perforatedCutoff: state.perforatedCutoff,
    })),
  )

  return (
    <View
      pointerEvents="none"
      style={[styles.main, perforatedCutoff ? styles.perforated : styles.blur]}
    />
  )
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
  perforated: (() => {
    const width =
      Math.min(maxWidth, runtime.screen.width - runtime.insets.right) / 16

    const height = width / 3
    const radius = width / 4

    return {
      backgroundImage: `radial-gradient(circle ${width}px at top, transparent ${radius}px, ${theme.colors.ui.bg} ${radius + 0.5}px)`,
      backgroundRepeat: 'round no-repeat',
      backgroundSize: `${width}px ${height}px`,
      height,
    }
  })(),
}))
