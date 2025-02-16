import { type BottomTabBarProps } from '@bottom-tabs/react-navigation'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon, type IconName } from '~/components/common/icon'
import { iPad, tintDark, tintLight } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = BottomTabBarProps

export function TabBar({ descriptors, navigation, state }: Props) {
  const router = useRouter()

  const { blurNavigation, themeOled, themeTint } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const gesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 100) {
      runOnJS(router.back)()
    }
  })

  const Component = blurNavigation ? BlurView : View

  return (
    <GestureDetector gesture={gesture}>
      <Component
        intensity={themeOled ? 25 : 75}
        style={styles.main(blurNavigation, themeOled, themeTint)}
        tint={theme.name === 'dark' ? tintDark : tintLight}
      >
        {state.routes
          .filter((route) => route.name.startsWith('('))
          .map((route, index) => {
            const options = descriptors[route.key]?.options
            const focused = state.index === index

            const icon = icons[route.name]

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
                {icon ? (
                  <Icon
                    color={
                      theme.colors[focused ? 'accent' : 'gray'].accentAlpha
                    }
                    name={icon}
                    size={theme.space[5]}
                    weight="duotone"
                  />
                ) : null}

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
      </Component>
    </GestureDetector>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  badge: {
    backgroundColor: theme.colors.accent.accent,
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
  main: (blur: boolean, oled: boolean, tint: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bgAlpha
      : theme.colors[tint ? 'accent' : 'gray'][blur ? 'bgAlpha' : 'bg'],
    borderTopColor: oled ? 'transparent' : theme.colors.gray.border,
    borderTopWidth: runtime.hairlineWidth,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 100,
  }),
  tab: {
    alignItems: 'center',
    flexGrow: iPad ? undefined : 1,
    paddingBottom: theme.space[3] + runtime.insets.bottom,
    paddingHorizontal: iPad ? theme.space[6] : undefined,
    paddingTop: theme.space[3],
  },
}))

const icons: Record<string, IconName> = {
  '(home)': 'House',
  '(notifications)': 'Bell',
  '(profile)': 'UserCircle',
  '(search)': 'MagnifyingGlass',
  '(settings)': 'GearSix',
}
