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
      style={[selected ? styles.selected : undefined, style]}
    >
      {icon ?? left}

      <Text
        lines={1}
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
            size: theme.typography[size === '2' ? '1' : '2'].lineHeight,
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
  selected: {
    backgroundColor: theme.colors.accent.uiActive,
  },
}))
