import { useState } from 'react'
import { type StyleProp, Switch, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { MenuSheet } from '~/sheets/menu'

import { type MenuItem } from '.'

type Props = {
  item: MenuItem
  style?: StyleProp<ViewStyle>
}

export function MenuItem({ item, style }: Props) {
  const { theme } = useStyles()

  const [loading, setLoading] = useState(false)

  const Component = item.type === 'switch' ? View : Pressable

  const selected =
    item.type === 'options'
      ? (item.options.find((option) => option.value === item.value)?.right ??
        item.options.find((option) => option.value === item.value)?.value)
      : null

  return (
    <Component
      align="center"
      direction="row"
      disabled={loading}
      gap="3"
      onPress={async () => {
        if (item.type === 'options') {
          const data = await MenuSheet.call({
            options: item.options,
            title: item.label,
            value: item.value,
          })

          item.onSelect(data.value)
        }

        if (item.onPress) {
          try {
            setLoading(true)

            await item.onPress()
          } finally {
            setLoading(false)
          }
        }
      }}
      px="3"
      style={style}
    >
      {loading ? (
        <Spinner
          color={item.icon?.color ?? theme.colors.accent.a9}
          size={theme.space[5]}
        />
      ) : item.icon ? (
        <Icon
          color={item.icon.color ?? theme.colors.accent.a9}
          name={item.icon.name}
          size={theme.space[5]}
          weight={item.icon.weight ?? 'duotone'}
        />
      ) : null}

      <View flex={1} gap="1" my="3">
        <Text weight="medium">{item.label}</Text>

        {item.description ? (
          <Text color="gray" highContrast={false} size="2">
            {item.description}
          </Text>
        ) : null}
      </View>

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
          thumbColor={theme.colors.gray.contrast}
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
  )
}
