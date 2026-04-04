import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { glass } from '~/lib/common'

type Props = {
  label: string
  labelStyle?: StyleProp<TextStyle>
  left?: ReactNode
  onPress?: () => void
  right?: ReactNode
  selected?: boolean
  style?: StyleProp<ViewStyle>
}

export function Item({
  label,
  labelStyle,
  left,
  onPress,
  right,
  selected,
  style,
}: Props) {
  styles.useVariants({
    selected,
  })

  return (
    <Pressable
      accessibilityLabel={label}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.main, style]}
    >
      {left}

      <Text
        numberOfLines={1}
        style={[styles.label, labelStyle]}
        weight="medium"
      >
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
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    marginHorizontal: glass ? 1 : undefined,
    paddingHorizontal: theme.space[3],
    variants: {
      selected: {
        true: {
          backgroundColor: theme.colors.accent.uiActive,
        },
      },
    },
  },
}))
