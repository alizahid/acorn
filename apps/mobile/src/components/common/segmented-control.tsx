import Component from '@expo/ui/community/segmented-control'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

type Props = {
  items: Array<{
    key: string
    label: string
  }>
  onChange: (key: string) => void
  style?: StyleProp<ViewStyle>
  value?: string
}

export function SegmentedControl({ items, onChange, style, value }: Props) {
  const { theme } = useUnistyles()

  return (
    <Component
      appearance={theme.variant}
      onValueChange={(key) => {
        const item = items.find(({ label }) => label === key)

        if (item) {
          onChange(item.key)
        }
      }}
      selectedIndex={items.findIndex((item) => item.key === value)}
      style={style}
      values={items.map((item) => item.label)}
    />
  )
}
