import {
  Switch as Component,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

type Props = {
  disabled?: boolean
  label: string
  onChange?: (value: boolean) => void
  style?: StyleProp<ViewStyle>
  value?: boolean
}

export function Switch({ label, disabled, style, onChange, value }: Props) {
  const { theme } = useUnistyles()

  return (
    <View style={style}>
      <Component
        accessibilityLabel={label}
        disabled={disabled}
        onValueChange={onChange}
        trackColor={{
          false: theme.colors.gray.accent,
          true: theme.colors.accent.accent,
        }}
        value={value}
      />
    </View>
  )
}
