import { type ReactNode } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

type Props = {
  disabled?: boolean
  label: string
  left?: ReactNode
  navigate?: boolean
  onPress?: () => void
  right?: ReactNode
  selected?: boolean
  style?: StyleProp<ViewStyle>
  styleSide?: StyleProp<ViewStyle>
}

export function ListItem({
  disabled,
  label,
  left,
  navigate,
  onPress,
  right,
  selected,
  style,
  styleSide,
}: Props) {
  styles.useVariants({
    selected,
  })

  return (
    <Pressable
      accessibilityLabel={label}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={[styles.main, style]}
    >
      {left ? <View style={[styles.side, styleSide]}>{left}</View> : null}

      <Text numberOfLines={1} size="2" style={styles.label} weight="medium">
        {label}
      </Text>

      {right ? <View style={[styles.side, styleSide]}>{right}</View> : null}

      {navigate ? (
        <View style={[styles.side, styleSide]}>
          <Icon
            name="caret-right"
            uniProps={(theme) => ({
              color: theme.colors.gray.textLow,
              size: theme.space[4],
            })}
          />
        </View>
      ) : null}
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
    height: theme.space[7],
    variants: {
      selected: {
        true: {
          backgroundColor: theme.colors.accent.bg,
        },
      },
    },
  },
  side: {
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.space[7],
    justifyContent: 'center',
    width: theme.space[8],
  },
}))
