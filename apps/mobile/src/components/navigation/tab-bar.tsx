import { type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from '../common/pressable'
import { View } from '../common/view'

type Props = BottomTabBarProps

export function TabBar({ descriptors, insets, navigation, state }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <View direction="row" style={styles.main}>
      {state.routes.map((route, index) => {
        const options = descriptors[route.key]?.options

        const focused = state.index === index

        return (
          <Pressable
            align="center"
            flexGrow={1}
            key={route.key}
            onLongPress={() => {
              navigation.emit({
                target: route.key,
                type: 'tabLongPress',
              })
            }}
            onPress={() => {
              const event = navigation.emit({
                canPreventDefault: true,
                target: route.key,
                type: 'tabPress',
              })

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params)
              }
            }}
            pt="4"
            style={styles.tab(insets.bottom)}
          >
            {options?.tabBarIcon?.({
              color: theme.colors[focused ? 'accent' : 'gray'].a9,
              focused,
              size: theme.space[5],
            })}
          </Pressable>
        )
      })}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray[1],
  },
  tab: (inset: number) => ({
    paddingBottom: theme.space[4] + inset,
  }),
}))
