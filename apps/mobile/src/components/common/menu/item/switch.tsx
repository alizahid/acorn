import { type ReactNode } from 'react'
import {
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Switch } from '../../switch'
import { MenuItemContent } from './content'

type Props = {
  arrow?: boolean
  description?: string
  icon?: ReactNode
  label: string
  labelStyle?: StyleProp<TextStyle>
  onChange?: (value: boolean) => void
  style?: StyleProp<ViewStyle>
  value: boolean
}

export function MenuItemSwitch({
  arrow,
  description,
  icon,
  label,
  labelStyle,
  onChange,
  style,
  value,
}: Props) {
  return (
    <View style={[styles.main, style]}>
      <MenuItemContent
        arrow={arrow}
        description={description}
        label={label}
        labelStyle={labelStyle}
        left={icon}
        right={<Switch label={label} onChange={onChange} value={value} />}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
  },
}))
