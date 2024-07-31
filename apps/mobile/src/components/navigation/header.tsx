import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'
import { HeaderButton } from './header-button'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function Header({ navigation, options, ...props }: Props) {
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  const back = 'back' in props ? Boolean(props.back) : false
  const left = back || options.headerLeft

  return (
    <View style={styles.main(insets.top)}>
      <View style={styles.header}>
        {left ? (
          <View style={[styles.actions, styles.left]}>
            {back ? (
              <HeaderButton
                icon="ArrowLeft"
                onPress={() => {
                  navigation.goBack()
                }}
                weight="bold"
              />
            ) : null}

            {options.headerLeft?.({
              canGoBack: back,
            })}
          </View>
        ) : null}

        {typeof options.headerTitle === 'function' ? (
          <View style={styles.title}>
            {options.headerTitle({
              children: options.title ?? '',
            })}
          </View>
        ) : (
          <Text weight="bold">{options.title}</Text>
        )}

        {options.headerRight ? (
          <View style={[styles.actions, styles.right]}>
            {options.headerRight({
              canGoBack: back,
            })}
          </View>
        ) : null}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  actions: {
    bottom: 0,
    flexDirection: 'row',
    gap: theme.space[2],
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
    backgroundColor: theme.colors.gray[1],
    paddingTop: inset,
  }),
  right: {
    right: 0,
  },
  title: {
    flexDirection: 'row',
    gap: theme.space[2],
  },
}))
