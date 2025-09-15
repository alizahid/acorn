import { type Ref } from 'react'
import { Switch as ReactNativeSwitch } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'

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
  onChange?: (value: boolean) => void
  ref?: Ref<ReactNativeSwitch>
  value?: boolean
}

export function Switch({ disabled, onChange, ref, value }: Props) {
  return (
    <View>
      <Component
        disabled={disabled}
        onValueChange={onChange}
        ref={ref}
        value={value}
      />
    </View>
  )
}
