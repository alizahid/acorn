import { Host, Toggle } from '@expo/ui/swift-ui'
import { tint } from '@expo/ui/swift-ui/modifiers'
import { useUnistyles } from 'react-native-unistyles'

type Props = {
  disabled?: boolean
  label: string
  onChange?: (value: boolean) => void
  value?: boolean
}

export function Switch({ label, onChange, value }: Props) {
  const { theme } = useUnistyles()

  return (
    <Host matchContents>
      <Toggle
        isOn={value}
        label={label}
        modifiers={[tint(theme.colors.accent.accent)]}
        onIsOnChange={onChange}
      />
    </Host>
  )
}
