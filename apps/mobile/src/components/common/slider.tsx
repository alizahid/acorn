import Component from '@react-native-community/slider'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'

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
  const { theme } = useStyles()

  return (
    <Component
      disabled={disabled}
      maximumTrackTintColor={theme.colors.gray.ui}
      maximumValue={max}
      minimumTrackTintColor={theme.colors.accent.accent}
      minimumValue={min}
      onValueChange={onChange}
      step={step}
      style={style}
      value={value}
    />
  )
}
