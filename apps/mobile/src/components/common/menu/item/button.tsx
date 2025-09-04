import { useMutation } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'

import { Pressable } from '~/components/common/pressable'

import { MenuItemContent } from './content'

type Props = {
  arrow?: boolean
  description?: string
  icon?: ReactNode
  label: string
  labelStyle?: StyleProp<TextStyle>
  onPress?: () => unknown
  style?: StyleProp<ViewStyle>
}

export function MenuItemButton({
  arrow,
  description,
  icon,
  label,
  labelStyle,
  onPress,
  style,
}: Props) {
  const { isPending, mutate } = useMutation({
    async mutationFn() {
      await onPress?.()
    },
  })

  return (
    <Pressable
      align="center"
      direction="row"
      gap="3"
      height="8"
      label={label}
      onPress={() => {
        mutate()
      }}
      px="3"
      style={style}
    >
      <MenuItemContent
        arrow={arrow}
        description={description}
        label={label}
        labelStyle={labelStyle}
        left={icon}
        loading={isPending}
      />
    </Pressable>
  )
}
