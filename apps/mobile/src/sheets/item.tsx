import { type ReactNode } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

type Props = {
  icon?: {
    color?: string
    name: IconName
  }
  label: string
  left?: ReactNode
  navigate?: boolean
  onPress: () => void
  selected?: boolean
}

export function SheetItem({
  icon,
  label,
  left,
  navigate,
  onPress,
  selected,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      gap="2"
      onPress={onPress}
      p="3"
      style={selected ? styles.selected : undefined}
    >
      {icon ? (
        <Icon
          color={icon.color ?? theme.colors.accent.a9}
          name={icon.name}
          size={theme.typography[2].lineHeight}
        />
      ) : (
        left
      )}

      <Text size="2" style={styles.label} weight="medium">
        {label}
      </Text>

      {navigate ? (
        <Icon
          color={theme.colors.gray.a11}
          name="CaretRight"
          size={theme.typography[2].lineHeight}
        />
      ) : null}
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
