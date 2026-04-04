import { useMutation } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

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
      accessibilityLabel={label}
      onPress={() => {
        mutate()
      }}
      style={[styles.main, style]}
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

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
  },
}))
