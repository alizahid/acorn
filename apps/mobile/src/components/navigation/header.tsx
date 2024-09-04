import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { BlurView } from 'expo-blur'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'

import { Text } from '../common/text'
import { View } from '../common/view'
import { HeaderButton } from './header-button'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function Header({ navigation, options, ...props }: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const back = 'back' in props ? Boolean(props.back) : false
  const left = back || options.headerLeft

  return (
    <BlurView intensity={100} style={styles.main(common.insets.top)}>
      <View align="center" height="8" justify="center">
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
          <View direction="row" gap="2">
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
    </BlurView>
  )
}

const stylesheet = createStyleSheet(() => ({
  actions: {
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
  left: {
    left: 0,
  },
  main: (inset: number) => ({
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
