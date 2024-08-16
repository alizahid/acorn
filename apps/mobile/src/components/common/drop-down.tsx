import { get } from 'lodash'
import { type ReactNode, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HeaderButton } from '../navigation/header-button'
import { Icon, type IconName, type IconWeight } from './icon'
import { Modal } from './modal'
import { Pressable } from './pressable'
import { Text } from './text'

export type DropDownItem = {
  icon?: {
    color?: string
    name: IconName
    weight?: IconWeight
  }
  items?: Array<DropDownItem>
  label: string
  left?: ReactNode
  value: string
}

type Props = {
  hideLabel?: boolean
  items: Array<DropDownItem>
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

  const [path, setPath] = useState<Array<number>>([])
  const [visible, setVisible] = useState(false)

  const selected = items.find((item) => item.value === value)

  const data =
    path.length > 0
      ? (get(
          items,
          path.flatMap((part) => [part, 'items']),
        ) as Array<DropDownItem>)
      : items

  return (
    <>
      <Pressable
        align="center"
        direction="row"
        gap="2"
        onPress={() => {
          setVisible((previous) => !previous)
        }}
        style={style}
      >
        {selected?.icon ? (
          <Icon
            color={selected.icon.color}
            name={selected.icon.name}
            size={theme.typography[3].lineHeight}
            weight={selected.icon.weight}
          />
        ) : null}

        {selected?.left}

        {!hideLabel ? (
          <Text weight="bold">{selected?.label ?? placeholder}</Text>
        ) : null}

        <Icon
          color={theme.colors.gray.a11}
          name="CaretDown"
          size={theme.space[4]}
        />
      </Pressable>

      <Modal
        left={
          path.length > 0 ? (
            <HeaderButton
              icon="ArrowLeft"
              onPress={() => {
                setPath((previous) => previous.slice(0, -1))
              }}
              weight="bold"
            />
          ) : null
        }
        onClose={() => {
          setVisible(false)
        }}
        title={placeholder}
        visible={visible}
      >
        {data.map((item, index) => (
          <Pressable
            align="center"
            direction="row"
            gap="2"
            key={item.value}
            onPress={() => {
              if (item.items) {
                setPath((previous) => [...previous, index])
              } else {
                onChange?.(item.value)

                setVisible(false)
              }
            }}
            p="3"
            style={item.value === value && styles.selected}
          >
            {item.icon ? (
              <Icon
                color={item.icon.color}
                name={item.icon.name}
                size={theme.typography[2].lineHeight}
                weight={item.icon.weight}
              />
            ) : null}

            {item.left}

            <Text size="2" style={styles.label} weight="medium">
              {item.label}
            </Text>

            {item.items ? (
              <Icon
                color={theme.colors.gray.a9}
                name="CaretRight"
                size={theme.space[4]}
              />
            ) : null}
          </Pressable>
        ))}
      </Modal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  label: {
    flex: 1,
  },
  selected: {
    backgroundColor: theme.colors.accent.a5,
  },
}))
