import { useRef, useState } from 'react'
import { type StyleProp, Switch, type ViewStyle } from 'react-native'
import ActionSheet, { type ActionSheetRef } from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { SheetHeader } from '~/sheets/header'
import { SheetItem } from '~/sheets/item'

import { type MenuItem } from '.'

type Props = {
  item: MenuItem
  style?: StyleProp<ViewStyle>
}

export function MenuItem({ item, style }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const sheet = useRef<ActionSheetRef>(null)

  const [loading, setLoading] = useState(false)

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
        disabled={loading}
        gap="3"
        onPress={async () => {
          if (item.type === 'options') {
            sheet.current?.show()
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

      {item.type === 'options' ? (
        <ActionSheet
          containerStyle={styles.sheet}
          gestureEnabled
          indicatorStyle={styles.indicator}
          overlayColor={theme.colors.gray.a9}
          ref={sheet}
        >
          <SheetHeader title={item.label} />

          {item.options.map((option) => (
            <SheetItem
              icon={option.icon}
              key={option.value}
              label={option.label}
              left={option.left}
              onPress={() => {
                item.onSelect(option.value)

                sheet.current?.hide()
              }}
              selected={option.value === item.value}
            />
          ))}
        </ActionSheet>
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  indicator: {
    display: 'none',
  },
  sheet: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: runtime.insets.bottom,
  },
}))
