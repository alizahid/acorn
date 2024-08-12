import { type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from '../common/pressable'

type Props = BottomTabBarProps

export function TabBar({ descriptors, insets, navigation, state }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <BlurView intensity={75} style={styles.main}>
      {state.routes.map((route, index) => {
        const options = descriptors[route.key]?.options

        const focused = state.index === index

        return (
          <Pressable
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
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  tab: (inset: number) => ({
    alignItems: 'center',
    flex: 1,
    paddingBottom: theme.space[4] + inset,
    paddingHorizontal: theme.space[2],
    paddingTop: theme.space[4],
  }),
}))
