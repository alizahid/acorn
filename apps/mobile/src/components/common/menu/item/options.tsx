import { type ReactElement, type ReactNode, useMemo, useRef } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

import { SheetItem } from '../../sheets/item'
import { SheetModal } from '../../sheets/modal'
import { MenuLabel } from '../label'
import { MenuSeparator } from '../separator'
import { MenuItemContent } from './content'

export type MenuItemOption<Type extends string | number> = {
  hideRight?: boolean
  icon?: ReactNode
  label: string
  labelStyle?: StyleProp<TextStyle>
  left?: ReactElement
  right?: ReactElement
  style?: StyleProp<ViewStyle>
  value: Type
}

type Props<Type extends string | number> = {
  arrow?: boolean
  description?: string
  hideSelected?: boolean
  icon?: ReactNode
  label: string
  labelStyle?: StyleProp<TextStyle>
  onChange: (value: Type) => void
  options: Array<MenuItemOption<Type> | string | null>
  style?: StyleProp<ViewStyle>
  title?: string
  value?: Type
}

export function MenuItemOptions<Type extends string | number>({
  arrow,
  description,
  hideSelected,
  icon,
  label,
  labelStyle,
  onChange,
  options,
  style,
  title,
  value,
}: Props<Type>) {
  const sheet = useRef<SheetModal>(null)

  const selected = useMemo(() => {
    const item = options
      .filter((option) => typeof option === 'object')
      .find((option) => option?.value === value)

    return item?.right ?? item?.value
  }, [options, value])

  return (
    <>
      <Pressable
        align="center"
        direction="row"
        gap="3"
        height="8"
        label={label}
        onPress={() => {
          sheet.current?.present()
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
          right={
            hideSelected ? null : typeof selected === 'string' ? (
              <Text color="accent" weight="bold">
                {selected}
              </Text>
            ) : (
              selected
            )
          }
        />
      </Pressable>

      <SheetModal
        container={options.length > 10 ? 'scroll' : 'view'}
        ref={sheet}
        title={title ?? label}
      >
        {options.map((option) => {
          if (option === null) {
            return <MenuSeparator />
          }

          if (typeof option === 'string') {
            return <MenuLabel>{option}</MenuLabel>
          }

          return (
            <SheetItem
              icon={option.icon}
              key={option.value}
              label={option.label}
              labelStyle={option.labelStyle}
              left={option.left}
              onPress={() => {
                onChange(option.value)

                sheet.current?.dismiss()
              }}
              right={option.hideRight ? null : option.right}
              selected={option.value === value}
              style={option.style}
            />
          )
        })}
      </SheetModal>
    </>
  )
}
