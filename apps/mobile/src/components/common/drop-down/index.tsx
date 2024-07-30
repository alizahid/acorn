import { type Placement, useFloating } from '@floating-ui/react-native'
import { type ReactNode, useState } from 'react'
import { Pressable, type StyleProp, View, type ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '../icon'
import { Text } from '../text'
import { Item } from './item'

export type DropDownItem = {
  icon?: {
    color?: string
    name: IconName
    weight?: IconWeight
  }
  label: string
  left?: ReactNode
  value: string
}

type Props = {
  hideLabel?: boolean
  items: Array<DropDownItem>
  onChange?: (value: string) => void
  placeholder?: string
  placement?: Placement
  style?: StyleProp<ViewStyle>
  value?: string
}

export function DropDown({
  hideLabel = false,
  items,
  onChange,
  placeholder,
  placement = 'bottom',
  style,
  value,
}: Props) {
  const frame = useSafeAreaFrame()

  const { styles, theme } = useStyles(stylesheet)

  const { floatingStyles, refs } = useFloating({
    placement,
  })

  const [open, setOpen] = useState(false)

  const selected = items.find((item) => item.value === value)

  return (
    <View>
      <Pressable
        onPress={() => {
          setOpen((previous) => !previous)
        }}
        ref={refs.setReference}
        style={[styles.trigger, style]}
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

      <View
        ref={refs.setFloating}
        style={styles.menu(frame.width, floatingStyles.left)}
      >
        {open ? (
          <>
            <View
              style={[
                styles.arrow,
                placement.includes('start') && styles.left,
                placement.includes('end') && styles.right,
              ]}
            />

            <View style={styles.content}>
              {items.map((item) => (
                <Item
                  item={item}
                  key={item.value}
                  onChange={(next) => {
                    setOpen(false)

                    onChange?.(next)
                  }}
                  value={value}
                />
              ))}
            </View>
          </>
        ) : null}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  arrow: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray[12],
    height: theme.space[3],
    position: 'absolute',
    top: -theme.space[1],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[3],
  },
  content: {
    borderRadius: theme.radius[5],
    overflow: 'hidden',
  },
  left: {
    left: theme.space[5],
  },
  menu: (frame: number, left: number) => ({
    backgroundColor: theme.colors.gray[12],
    borderRadius: theme.radius[5],
    left,
    marginTop: theme.space[1],
    position: 'absolute',
    top: '100%',
    width: frame / 3,
  }),
  right: {
    right: theme.space[5],
  },
  trigger: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
}))
