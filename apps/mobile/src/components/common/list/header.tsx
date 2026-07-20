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

      {right}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.space[7],
  },
  title: {
    flex: 1,
    marginHorizontal: theme.space[3],
  },
}))
