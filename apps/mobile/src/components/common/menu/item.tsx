import { Image } from 'expo-image'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { ContextMenuButton } from 'react-native-ios-context-menu'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { menu } from '~/assets/menu'
import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'

import { Switch } from '../switch'
import { type MenuItem } from '.'

type Props = {
  item: MenuItem
  style?: StyleProp<ViewStyle>
}

export function MenuItem({ item, style }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const [loading, setLoading] = useState(false)

  const Component =
    item.type === 'options'
      ? ContextMenuButton
      : item.type === 'switch'
        ? View
        : Pressable

  const selected =
    item.type === 'options'
      ? (item.options.find((option) => option.value === item.value)?.right ??
        item.options.find((option) => option.value === item.value)?.value)
      : null

  return (
    <Component
      menuConfig={
        item.type === 'options'
          ? {
              menuItems: item.options.map((option) => ({
                actionKey: option.value,
                actionTitle: option.label,
                icon:
                  option.icon?.type === 'menu'
                    ? {
                        imageOptions: {
                          tint: option.icon.color ?? theme.colors.accent[9],
                        },
                        imageValue: menu[option.icon.name],
                        type: 'IMAGE_REQUIRE',
                      }
                    : option.icon?.type === 'symbol'
                      ? {
                          iconTint: option.icon.color ?? theme.colors.accent[9],
                          iconType: 'SYSTEM',
                          iconValue: option.icon.name,
                        }
                      : undefined,
                menuState: option.value === item.value ? 'on' : undefined,
              })),
              menuTitle: item.label,
            }
          : undefined
      }
      onPress={async () => {
        if (item.onPress) {
          try {
            setLoading(true)

            await item.onPress()
          } finally {
            setLoading(false)
          }
        }
      }}
      onPressMenuItem={(event) => {
        if (item.type === 'options') {
          item.onSelect(event.nativeEvent.actionKey)
        }
      }}
      style={[styles.main, style]}
    >
      {loading ? (
        <Spinner
          color={item.icon?.color ?? theme.colors.accent.a9}
          size={theme.space[5]}
        />
      ) : item.icon ? (
        item.icon.type === 'menu' ? (
          <Image
            source={menu[item.icon.name]}
            style={styles.icon}
            tintColor={item.icon.color ?? theme.colors.accent.a9}
          />
        ) : item.icon.type === 'symbol' ? (
          <SymbolView
            name={item.icon.name}
            size={theme.space[5]}
            tintColor={item.icon.color ?? theme.colors.accent.a9}
          />
        ) : (
          <Icon
            color={item.icon.color ?? theme.colors.accent.a9}
            name={item.icon.name}
            size={theme.space[5]}
            weight={item.icon.weight ?? 'duotone'}
          />
        )
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
          onChange={(value) => {
            item.onSelect(value)
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

const stylesheet = createStyleSheet((theme) => ({
  icon: {
    height: theme.space[5],
    width: theme.space[5],
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    paddingHorizontal: theme.space[3],
  },
}))
