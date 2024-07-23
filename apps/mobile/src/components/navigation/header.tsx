import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { BlurView } from 'expo-blur'
import { View } from 'react-native'
import ArrowLeftIcon from 'react-native-phosphor/src/bold/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'
import { HeaderButton } from './header-button'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function Header({ navigation, options, ...props }: Props) {
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  const back = 'back' in props
  const left = back || options.headerLeft

  return (
    <BlurView intensity={100} style={styles.main(insets.top)}>
      <View style={styles.header}>
        {left ? (
          <View style={[styles.actions, styles.left]}>
            {back ? (
              <HeaderButton
                Icon={ArrowLeftIcon}
                onPress={() => {
                  navigation.goBack()
                }}
              />
            ) : null}

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
