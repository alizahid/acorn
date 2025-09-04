import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'

import { View } from '~/components/common/view'

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
    <View
      align="center"
      direction="row"
      gap="3"
      height="8"
      px="3"
      style={style}
    >
      <MenuItemContent
        arrow={arrow}
        description={description}
        label={label}
        labelStyle={labelStyle}
        left={icon}
        right={<Switch onChange={onChange} value={value} />}
      />
    </View>
  )
}
