import { type ReactNode } from 'react'
import {
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from '~/components/common/text'

type Props = {
  left?: ReactNode
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
  titleStyle?: StyleProp<TextStyle>
}

export function ListHeader({ left, right, style, title, titleStyle }: Props) {
  return (
    <View style={[styles.main, style]}>
      {left ? <View style={styles.left}>{left}</View> : null}

      <Text style={titleStyle} weight="bold">
        {title}
      </Text>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  left: {
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  main: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}))
