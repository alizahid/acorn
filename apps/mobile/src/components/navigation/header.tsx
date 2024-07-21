import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { BlurView } from 'expo-blur'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function Header({ navigation, options }: Props) {
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  const back = navigation.canGoBack()
  const left = back || options.headerLeft

  return (
    <BlurView intensity={100} style={styles.main(insets.top)}>
      <View style={styles.header}>
        {left ? (
          <View style={[styles.actions, styles.left]}>
            {back ? null : null}

            {options.headerLeft?.({
              canGoBack: back,
            })}
          </View>
        ) : null}

        {typeof options.headerTitle === 'function' ? (
          options.headerTitle({
            children: options.title ?? '',
          })
        ) : (
          <Text highContrast weight="bold">
            {options.title}
          </Text>
        )}

        {options.headerRight ? (
          <View style={[styles.actions, styles.right]}>
            {options.headerRight({
              canGoBack: back,
            })}
          </View>
        ) : null}
      </View>
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  actions: {
    bottom: 0,
    position: 'absolute',
  },
  header: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
  },
  left: {
    left: 0,
  },
  main: (inset: number) => ({
    backgroundColor: theme.colors.grayA[1],
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
  right: {
    right: 0,
  },
}))
