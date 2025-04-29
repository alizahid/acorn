import { type Ref } from 'react'
import { Switch as ReactNativeSwitch } from 'react-native'
import { useStyles } from 'react-native-unistyles'

type Props = {
  disabled?: boolean
  onChange?: (value: boolean) => void
  ref?: Ref<ReactNativeSwitch>
  value?: boolean
}

export function Switch({ disabled, onChange, ref, value }: Props) {
  const { theme } = useStyles()

  return (
    <ReactNativeSwitch
      disabled={disabled}
      ios_backgroundColor={theme.colors.gray.uiActive}
      onValueChange={onChange}
      ref={ref}
      thumbColor={theme.colors.gray.contrast}
      trackColor={{
        false: theme.colors.gray.uiActive,
        true: theme.colors.accent.accent,
      }}
      value={value}
    />
  )
}
