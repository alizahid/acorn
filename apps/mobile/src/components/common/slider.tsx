import Component from '@react-native-community/slider'
import { range } from 'lodash'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { View } from './view'

type Props = {
  disabled?: boolean
  max?: number
  min?: number
  onChange: (value: number) => void
  step?: number
  style?: StyleProp<ViewStyle>
  value: number
}

export function Slider({
  disabled,
  max,
  min,
  onChange,
  step,
  style,
  value,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={style}>
      {!disabled && step && min && max ? (
        <View
          align="center"
          direction="row"
          justify="between"
          pointerEvents="none"
          style={styles.markers}
        >
          {range(min, max + step, step).map((item) => (
            <View key={item} style={styles.marker(item <= value)} />
          ))}
        </View>
      ) : null}

      <Component
        disabled={disabled}
        maximumTrackTintColor={theme.colors.gray.ui}
        maximumValue={max}
        minimumTrackTintColor={theme.colors.accent.accent}
        minimumValue={min}
        onValueChange={onChange}
        step={step}
        tapToSeek
        value={value}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  marker: (enabled: boolean) => ({
    backgroundColor: enabled
      ? theme.colors.accent.accent
      : theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    height: theme.space[3],
    width: theme.space[1],
  }),
  markers: {
    height: '100%',
    left: 14,
    position: 'absolute',
    right: 14,
  },
}))
