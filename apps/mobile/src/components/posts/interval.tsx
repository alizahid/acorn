import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { IntervalIcons } from '~/lib/sort'
import { type TopInterval } from '~/types/sort'

type ItemProps = {
  interval: TopInterval
  size?: number
}

export function TopIntervalItem({ interval, size }: ItemProps) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={styles.main(size ?? theme.space[4])}>
      <Text
        style={[
          styles.label(size ?? theme.space[4]),
          interval === 'all' && styles.infinity(size ?? theme.space[4]),
        ]}
      >
        {IntervalIcons[interval]}
      </Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  infinity: (size: number) => ({
    fontSize: size * 0.8,
  }),
  label: (size: number) => ({
    color: theme.colors.gold.contrast,
    fontFamily: 'sans',
    fontSize: size / 2,
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
    textAlign: 'center',
  }),
  main: (size: number) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.gold.a9,
    borderCurve: 'continuous',
    borderRadius: size,
    height: size,
    justifyContent: 'center',
    width: size,
  }),
}))
