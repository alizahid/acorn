import { type ReactNode } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

type Props = {
  left?: ReactNode
  onPress?: () => void
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
}

export function Header({ left, onPress, right, style, title }: Props) {
  return (
    <Pressable
      accessibilityLabel={title}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.main, style]}
    >
      {left ? <View style={styles.left}>{left}</View> : null}

      <Text align="center" numberOfLines={1} style={styles.title} weight="bold">
        {title}
      </Text>

      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  left: {
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
  },
  right: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: {
    flex: 1,
  },
}))
