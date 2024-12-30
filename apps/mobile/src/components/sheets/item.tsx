import { type SFSymbol, SymbolView } from 'expo-symbols'
import { type ReactNode } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName, type IconWeight } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

type Icon =
  | {
      color?: string
      name: SFSymbol
      type: 'symbol'
    }
  | {
      color?: string
      name: IconName
      type: 'icon'
      weight?: IconWeight
    }

type Props = {
  icon?: Icon
  label: string
  left?: ReactNode
  navigate?: boolean
  onPress: () => void
  right?: ReactNode
  selected?: boolean
}

export function SheetItem({
  icon,
  label,
  left,
  navigate,
  onPress,
  right,
  selected,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      gap="3"
      height="8"
      onPress={onPress}
      px="3"
      style={selected ? styles.selected : undefined}
    >
      {icon ? (
        icon.type === 'symbol' ? (
          <SymbolView
            name={icon.name}
            size={theme.space[5]}
            tintColor={icon.color ?? theme.colors.accent.a9}
          />
        ) : (
          <Icon
            color={icon.color ?? theme.colors.accent.a9}
            name={icon.name}
            size={theme.space[5]}
            weight={icon.weight ?? 'duotone'}
          />
        )
      ) : (
        left
      )}

      <Text lines={1} style={styles.label} weight="medium">
        {label}
      </Text>

      {navigate ? (
        <Icon
          color={theme.colors.gray.a11}
          name="CaretRight"
          size={theme.typography[2].lineHeight}
        />
      ) : (
        right
      )}
    </Pressable>
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
