import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'

import { View } from '../view'

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
      align="center"
      direction="row"
      disabled={!onPress}
      gap="3"
      height="8"
      label={title}
      onPress={onPress}
      px="3"
      style={style}
    >
      {left ? (
        <View direction="row" style={styles.left}>
          {left}
        </View>
      ) : null}

      <Text
        align="center"
        contrast
        lines={1}
        style={styles.title}
        weight="bold"
      >
        {title}
      </Text>

      {right ? (
        <View direction="row" style={styles.right}>
          {right}
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  left: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: {
    flex: 1,
  },
})
