import Component from '@expo/ui/community/segmented-control'
import { useUnistyles } from 'react-native-unistyles'

type Props = {
  items: Array<{
    key: string
    label: string
  }>
  onChange: (key: string) => void
  value?: string
}

export function SegmentedControl({ items, onChange, value }: Props) {
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
      values={items.map((item) => item.label)}
    />
  )
}
