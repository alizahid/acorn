import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

type Props = {
  label: string
  left?: ReactNode
  onPress?: () => void
  right?: ReactNode
  selected?: boolean
  style?: StyleProp<ViewStyle>
}

export function Item({ label, left, onPress, right, selected, style }: Props) {
  styles.useVariants({
    selected,
  })

  return (
    <Pressable
      align="center"
      direction="row"
      disabled={!onPress}
      gap="3"
      height="8"
      label={label}
      onPress={onPress}
      px="3"
      style={[styles.main, style]}
    >
      {left}

      <Text lines={1} style={styles.label} weight="medium">
        {label}
      </Text>

      {right}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  label: {
    flex: 1,
  },
  main: {
    variants: {
      selected: {
        true: {
          backgroundColor: theme.colors.accent.uiActive,
        },
      },
    },
  },
}))
