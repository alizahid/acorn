import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'
import { View } from '../common/view'
import { HeaderButton } from './header-button'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function Header({ navigation, options, ...props }: Props) {
  const { styles } = useStyles(stylesheet)

  const back = 'back' in props ? Boolean(props.back?.title) : false
  const left = back || options.headerLeft
  const modal = 'presentation' in options && options.presentation === 'modal'

  return (
    <View style={styles.main(modal)}>
      <View align="center" height="8" justify="center">
        {left ? (
          <View style={[styles.actions, styles.left]}>
            {back ? (
              <HeaderButton
                icon={modal ? 'X' : 'ArrowLeft'}
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
          <Text lines={1} style={styles.title} weight="bold">
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
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  actions: {
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
  left: {
    left: 0,
  },
  main: (modal: boolean) => ({
    backgroundColor: theme.colors.gray[modal ? 2 : 1],
    paddingTop: modal ? 0 : runtime.insets.top,
  }),
  right: {
    right: 0,
  },
  title: {
    maxWidth: '50%',
  },
}))
