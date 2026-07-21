import { useHeaderHeight } from 'expo-router/react-navigation'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useBottomTabBarHeight } from 'react-native-bottom-tabs'
import { StyleSheet } from 'react-native-unistyles'

import { Spinner } from './spinner'

type Props = {
  style?: StyleProp<ViewStyle>
}

export function Loading({ style }: Props) {
  const headerHeight = useHeaderHeight()
  const tabBarHeight = useBottomTabBarHeight()

  return (
    <View style={[styles.main(headerHeight, tabBarHeight), style]}>
      <Spinner size="large" />
    </View>
  )
}

const styles = StyleSheet.create((_theme, runtime) => ({
  main: (headerHeight: number, tabBarHeight: number) => ({
    alignItems: 'center',
    height: runtime.screen.height - headerHeight - tabBarHeight - 256,
    justifyContent: 'center',
  }),
}))
