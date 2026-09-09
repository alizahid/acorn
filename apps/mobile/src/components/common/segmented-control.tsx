import Component from '@expo/ui/community/segmented-control'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

type Props = {
  items: Array<{
    label: string
    value: string
  }>
  onChange: (key: string) => void
  style?: StyleProp<ViewStyle>
  value?: string
}

export function SegmentedControl({ items, onChange, style, value }: Props) {
  const { theme } = useUnistyles()

  const selected = items.findIndex((item) => item.value === value)

  return (
    <Component
      appearance={theme.variant}
      onValueChange={(label) => {
        const next = items.find((item) => item.label === label)

        if (next) {
          onChange(next.value)
        }
      }}
      selectedIndex={selected}
      style={style}
      tintColor={theme.colors.accent.accent}
      values={items.map((item) => item.label)}
    />
  )
}
