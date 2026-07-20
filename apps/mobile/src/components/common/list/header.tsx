import { type ReactNode } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from '~/components/common/text'

type Props = {
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
}

export function ListHeader({ right, style, title }: Props) {
  return (
    <View style={[styles.main, style]}>
      <Text style={styles.title} weight="bold">
        {title}
      </Text>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.space[7],
  },
  right: {
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.space[7],
    justifyContent: 'center',
    width: theme.space[8],
  },
  title: {
    flex: 1,
    marginHorizontal: theme.space[3],
  },
}))
