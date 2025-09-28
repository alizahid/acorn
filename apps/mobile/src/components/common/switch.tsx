import { type Ref } from 'react'
import { Switch as ReactNativeSwitch } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { View } from './view'

const Component = withUnistyles(ReactNativeSwitch, (theme) => ({
  ios_backgroundColor: theme.colors.gray.uiActive,
  thumbColor: theme.colors.gray.contrast,
  trackColor: {
    false: theme.colors.gray.uiActive,
    true: theme.colors.accent.accent,
  },
}))

type Props = {
  disabled?: boolean
  label: string
  onChange?: (value: boolean) => void
  ref?: Ref<ReactNativeSwitch>
  value?: boolean
}

export function Switch({ disabled, label, onChange, ref, value }: Props) {
  const a11y = useTranslations('a11y')

  return (
    <View>
      <Component
        accessibilityHint={a11y('toggle')}
        accessibilityLabel={label}
        accessibilityState={{
          checked: value,
        }}
        disabled={disabled}
        onValueChange={onChange}
        ref={ref}
        value={value}
      />
    </View>
  )
}
