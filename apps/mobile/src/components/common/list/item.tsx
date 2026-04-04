import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { type TypographyToken } from '~/styles/tokens'

type Props = {
  icon?: ReactNode
  label: string
  labelStyle?: StyleProp<TextStyle>
  left?: ReactNode
  navigate?: boolean
  onPress?: () => void
  right?: ReactNode
  selected?: boolean
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
}

export function ListItem({
  icon,
  label,
  labelStyle,
  left,
  navigate,
  onPress,
  right,
  selected,
  size,
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
      {icon ?? left}

      <Text
        numberOfLines={1}
        size={size}
        style={[styles.label, labelStyle]}
        weight="medium"
      >
        {label}
      </Text>

      {navigate ? (
        <Icon
          name="chevron.right"
          uniProps={(theme) => ({
            size: theme.space[3],
            tintColor: theme.colors.gray.textLow,
          })}
        />
      ) : (
        right
      )}
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
