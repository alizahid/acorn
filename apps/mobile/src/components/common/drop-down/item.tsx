import React from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon } from '../icon'
import { Pressable } from '../pressable'
import { Text } from '../text'
import { type DropDownItem } from '.'

type Props = {
  item: DropDownItem
  onChange?: (value: string) => void
  value?: string
}

export function Item({ item, onChange, value }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const selected = item.value === value

  return (
    <Pressable
      onPress={() => {
        onChange?.(item.value)
      }}
      style={[styles.main, selected && styles.selected]}
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
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  label: {
    color: theme.colors.gray[1],
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[3],
  },
  selected: {
    backgroundColor: theme.colors.accent[9],
  },
}))
