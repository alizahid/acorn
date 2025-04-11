import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { SymbolView } from 'expo-symbols'
import { useMemo, useRef } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'

import { SheetItem } from '../sheets/item'
import { SheetModal } from '../sheets/modal'
import { Switch } from '../switch'
import { type MenuItem } from '.'

type Props = {
  item: MenuItem
  style?: StyleProp<ViewStyle>
}

export function MenuItem({ item, style }: Props) {
  const { theme } = useStyles()

  const sheet = useRef<BottomSheetModal>(null)

  const { isPending, mutate } = useMutation<
    unknown,
    Error,
    () => void | Promise<void>
  >({
    async mutationFn(action) {
      await action()
    },
  })

  const Component = item.type === 'switch' ? View : Pressable

  const selected = useMemo(() => {
    if (item.type === 'options') {
      const $selected = item.options
        .filter((option) => typeof option === 'object')
        .find((option) => option?.value === item.value)

      return $selected?.right ?? $selected?.value
    }

    return null
  }, [item])

  return (
    <>
      <Component
        align="center"
        direction="row"
        gap="3"
        height="8"
        label={item.label}
        onPress={() => {
          if (item.onPress) {
            mutate(item.onPress)
          }

          if (item.type === 'options') {
            sheet.current?.present()
          }
        }}
        px="3"
        style={style}
      >
        {isPending ? (
          <Spinner
            color={item.icon?.color ?? theme.colors.accent.accent}
            size={theme.space[5]}
          />
        ) : item.icon ? (
          item.icon.type === 'symbol' ? (
            <SymbolView
              name={item.icon.name}
              size={theme.space[5]}
              tintColor={item.icon.color ?? theme.colors.accent.accent}
            />
          ) : (
            <Icon
              color={item.icon.color ?? theme.colors.accent.accent}
              name={item.icon.name}
              size={theme.space[5]}
              weight={item.icon.weight ?? 'duotone'}
            />
          )
        ) : null}

        <View flex={1}>
          <Text style={item.labelStyle} weight="medium">
            {item.label}
          </Text>

          {item.description ? (
            <Text color="gray" highContrast={false} size="1">
              {item.description}
            </Text>
          ) : null}
        </View>

        {item.hideSelected ? null : typeof selected === 'string' ? (
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
            color={theme.colors.gray.accent}
            name="CaretRight"
            size={theme.space[4]}
          />
        ) : null}
      </Component>

      {item.type === 'options' ? (
        <SheetModal
          container={item.options.length > 6 ? 'scroll' : 'view'}
          ref={sheet}
          title={item.title ?? item.label}
        >
          {item.options.map((option, index) => {
            if (option === null) {
              // eslint-disable-next-line react/no-array-index-key -- go away
              return <View height="4" key={`separator-${index}`} />
            }

            if (typeof option === 'string') {
              return (
                <Text
                  highContrast={false}
                  key={option}
                  mb="2"
                  mt="3"
                  mx="3"
                  size="2"
                  weight="medium"
                >
                  {option}
                </Text>
              )
            }
            return (
              <SheetItem
                icon={'icon' in option ? option.icon : undefined}
                key={option.value}
                label={option.label}
                labelStyle={option.labelStyle}
                left={option.left}
                onPress={() => {
                  item.onSelect(option.value)

                  sheet.current?.dismiss()
                }}
                right={!option.hideRight ? option.right : null}
                selected={option.value === item.value}
                style={option.style}
              />
            )
          })}
        </SheetModal>
      ) : null}
    </>
  )
}
