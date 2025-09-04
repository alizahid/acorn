import { type BottomTabBarProps } from '@bottom-tabs/react-navigation'
import { useRouter } from 'expo-router'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { Icon, type IconName } from '~/components/common/icon'
import { iPad, tintDark, tintLight } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { BlurView } from '../native/blur-view'

type Props = BottomTabBarProps

export function TabBar({ descriptors, navigation, state }: Props) {
  const router = useRouter()

  const { blurNavigation, themeOled, themeTint } = usePreferences()

  styles.useVariants({
    blur: blurNavigation,
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

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
        style={styles.main}
        uniProps={(theme) => ({
          tint: theme.variant === 'dark' ? tintDark : tintLight,
        })}
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
                label={options?.title ?? 'Tab'}
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

                  if (!(focused || event.defaultPrevented)) {
                    navigation.navigate(route.name, route.params)
                  }
                }}
                state={{
                  selected: focused,
                }}
                style={styles.tab}
              >
                {icon ? (
                  <Icon
                    name={icon}
                    uniProps={(theme) => ({
                      color:
                        theme.colors[focused ? 'accent' : 'gray'].accentAlpha,
                    })}
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

const styles = StyleSheet.create((theme, runtime) => ({
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
  main: {
    backgroundColor: theme.colors.gray.bg,
    borderTopColor: theme.colors.gray.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    compoundVariants: [
      {
        blur: true,
        styles: {
          backgroundColor: theme.colors.accent.bgAlpha,
        },
        tint: true,
      },
    ],
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    variants: {
      blur: {
        true: {
          backgroundColor: theme.colors.gray.bgAlpha,
        },
      },
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
          borderTopColor: 'transparent',
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bg,
        },
      },
    },
    zIndex: 100,
  },
  tab: {
    alignItems: 'center',
    paddingBottom: theme.space[3] + runtime.insets.bottom,
    paddingTop: theme.space[3],
    variants: {
      iPad: {
        false: {
          flexGrow: 1,
        },
        true: {
          paddingHorizontal: theme.space[6],
        },
      },
    },
  },
}))

const icons: Record<string, IconName> = {
  '(home)': 'House',
  '(notifications)': 'Bell',
  '(profile)': 'UserCircle',
  '(search)': 'MagnifyingGlass',
  '(settings)': 'GearSix',
}
