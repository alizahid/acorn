import React, { type ReactNode, useRef } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import CaretDownIcon from 'react-native-phosphor/src/bold/CaretDown'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Modal } from '~/components/modal'

import { Pressable } from './pressable'
import { Text } from './text'

type Item = {
  icon?: ReactNode
  label: string
  value: string
}

type Props = {
  hideLabel?: boolean
  items: Array<Item>
  onChange?: (value: string) => void
  placeholder?: string
  style?: StyleProp<ViewStyle>
  value?: string
}

export function DropDown({
  hideLabel = false,
  items,
  onChange,
  placeholder,
  style,
  value,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const modal = useRef<Modal>(null)

  const selected = items.find((item) => item.value === value)

  return (
    <View>
      <Pressable
        onPress={() => {
          modal.current?.open()
        }}
        style={[styles.main, style]}
      >
        {selected?.icon}

        {!hideLabel ? (
          <Text weight="bold">{selected?.label ?? placeholder}</Text>
        ) : null}

        <CaretDownIcon color={theme.colors.gray.a11} size={theme.space[4]} />
      </Pressable>

      <Modal inset ref={modal} title={placeholder}>
        {items.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => {
              onChange?.(item.value)

              modal.current?.close()
            }}
            style={[styles.item, item.value === value && styles.selected]}
          >
            {item.icon}

            <Text weight="medium">{item.label}</Text>
          </Pressable>
        ))}
      </Modal>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[3],
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  selected: {
    backgroundColor: theme.colors.accent.a5,
  },
}))
