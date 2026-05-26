import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Logo } from './logo'
import { Text } from './text'

type Props = {
  style?: StyleProp<ViewStyle>
}

export function Banner({ style }: Props) {
  return (
    <View style={[styles.banner, style]}>
      <Text size="1">Browse Reddit with Acorn</Text>

      <Logo style={styles.logo} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  banner: {
    alignItems: 'center',
    backgroundColor: theme.colors.orange.bgAlt,
    flexDirection: 'row',
    height: theme.space[7],
    justifyContent: 'space-between',
    padding: theme.space[3],
  },
  logo: {
    height: theme.space[5],
    width: theme.space[5],
  },
}))
