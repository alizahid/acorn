import { useState } from 'react'
import { type StyleProp, Switch, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Modal } from '~/components/common/modal'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'

import { type SettingsItem } from '.'

type Props = {
  item: SettingsItem
  style?: StyleProp<ViewStyle>
}

export function SettingsItem({ item, style }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const Component = item.type === 'switch' ? View : Pressable

  const selected =
    item.type === 'options'
      ? (item.options.find((option) => option.value === item.value)?.right ??
        item.options.find((option) => option.value === item.value)?.value)
      : null

  return (
    <>
      <Component
        align="center"
        direction="row"
        gap="3"
        onPress={() => {
          if (item.type === 'options') {
            setVisible(true)
          } else if (item.onPress) {
            item.onPress()
          }
        }}
        px="3"
        style={style}
      >
        {item.icon ? (
          <Icon
            color={item.icon.color ?? theme.colors.accent.a9}
            name={item.icon.name}
            size={theme.space[5]}
            weight={item.icon.weight ?? 'duotone'}
          />
        ) : null}

        <Text my="3" style={styles.label} weight="medium">
          {item.label}
        </Text>

        {typeof selected === 'string' ? (
          <Text color="accent" weight="bold">
            {selected}
          </Text>
        ) : (
          selected
        )}

        {item.type === 'switch' ? (
          <Switch
            ios_backgroundColor={theme.colors.gray.a5}
            onValueChange={(value) => {
              item.onSelect(value)
            }}
            thumbColor={theme.colors.white.a12}
            trackColor={{
              false: theme.colors.gray.a5,
              true: theme.colors.accent.a9,
            }}
            value={item.value}
          />
        ) : null}

        {item.arrow ? (
          <Icon
            color={theme.colors.gray.a9}
            name="CaretRight"
            size={theme.space[4]}
          />
        ) : null}
      </Component>

      {item.type === 'options' ? (
        <Modal
          onClose={() => {
            setVisible(false)
          }}
          title={item.label}
          visible={visible}
        >
          {item.options.map((option) => (
            <Pressable
              align="center"
              direction="row"
              gap="3"
              key={option.value}
              onPress={() => {
                item.onSelect(option.value)

                setVisible(false)
              }}
              px="3"
              style={option.value === item.value && styles.selected}
            >
              {option.icon ? (
                <Icon
                  color={option.icon.color ?? theme.colors.accent.a9}
                  name={option.icon.name}
                  size={theme.typography[2].lineHeight}
                  weight={option.icon.weight}
                />
              ) : null}

              {option.left}

              <Text my="3" size="2" style={styles.label} weight="medium">
                {option.label}
              </Text>
            </Pressable>
          ))}
        </Modal>
      ) : null}
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
