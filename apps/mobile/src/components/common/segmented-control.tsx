import { Button, Host, Picker } from '@expo/ui/swift-ui'
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers'
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
    <Host colorScheme={theme.variant} matchContents>
      <Picker
        label="Select a fruit"
        modifiers={[pickerStyle('segmented')]}
        onSelectionChange={(selection) => {
          onChange(selection)
        }}
        selection={value}
      >
        {items.map((item) => (
          <Button
            key={item.key}
            label={item.label}
            modifiers={[tag(item.key)]}
          />
        ))}
      </Picker>
    </Host>
  )
}
