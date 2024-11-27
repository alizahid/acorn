import { type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'
import { View } from '../common/view'

type Props = BottomTabBarProps

export function TabBar({ descriptors, navigation, state }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  function goBack() {
    router.back()
  }

  const gesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 100) {
      runOnJS(goBack)()
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <View direction="row" style={styles.main}>
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
              style={styles.tab}
            >
              {options?.tabBarIcon?.({
                color: theme.colors[focused ? 'accent' : 'gray'].a9,
                focused,
                size: theme.space[5],
              })}

              {options?.tabBarBadge ? (
                <View style={styles.badge}>
                  <Text contrast size="1" tabular weight="medium">
                    {options.tabBarBadge}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          )
        })}
      </View>
    </GestureDetector>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  badge: {
    backgroundColor: theme.colors.accent.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] * 0.4,
    position: 'absolute',
    transform: [
      {
        translateX: theme.space[3],
      },
      {
        translateY: theme.space[2],
      },
    ],
  },
  main: {
    backgroundColor: theme.colors.gray[1],
  },
  tab: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: theme.space[4] + runtime.insets.bottom,
    paddingTop: theme.space[4],
  },
}))
