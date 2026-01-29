import { type BottomTabBarProps } from '@bottom-tabs/react-navigation'
import { usePathname, useRouter } from 'expo-router'
import { type SFSymbol } from 'expo-symbols'
import { useEffect, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

import { Icon } from '~/components/common/icon'
import { iPad, tints } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { space } from '~/styles/tokens'
import { type BottomTab } from '~/types/defaults'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { BlurView } from '../native/blur-view'

type Props = BottomTabBarProps

export function TabBar({ descriptors, navigation, state }: Props) {
  const insets = useSafeAreaInsets()

  const router = useRouter()
  const path = usePathname()

  const { tabs } = useDefaults()
  const { blurNavigation, themeOled, themeTint } = usePreferences()

  styles.useVariants({
    blur: blurNavigation,
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const [visible, setVisible] = useState(true)

  const gesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 100) {
      scheduleOnRN(router.back)
    }
  })

  useEffect(() => {
    function onShow() {
      setVisible(true)
    }

    function onHide() {
      setVisible(false)
    }

    mitter.on('show-tab-bar', onShow)
    mitter.on('hide-tab-bar', onHide)

    return () => {
      mitter.off('show-tab-bar', onShow)
      mitter.off('hide-tab-bar', onHide)
    }
  }, [])

  useEffect(() => {
    setVisible(Boolean(path))
  }, [path])

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          visible ? 0 : space[3] + space[5] + space[3] + insets.bottom,
        ),
      },
    ],
  }))

  const Component = blurNavigation ? BlurView : View

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style}>
        <Component
          intensity={themeOled ? 25 : 75}
          style={styles.main}
          uniProps={(theme) => ({
            tint: tints[theme.variant],
          })}
        >
          {tabs
            .filter((tab) => tab.key === '(settings)' || !tab.disabled)
            .map((tab) => {
              const item = state.routes.find((route) => route.name === tab.key)

              const options = item ? descriptors[item.key]?.options : undefined
              const focused = state.routeNames[state.index] === tab.key

              const icon = icons[tab.key]

              return (
                <Pressable
                  accessibilityLabel={options?.title ?? 'Tab'}
                  accessibilityState={{
                    selected: focused,
                  }}
                  key={tab.key}
                  onLongPress={() => {
                    if (!item) {
                      return
                    }

                    navigation.emit({
                      target: item.key,
                      type: 'tabLongPress',
                    })
                  }}
                  onPress={() => {
                    if (!item) {
                      return
                    }

                    const event = navigation.emit({
                      canPreventDefault: true,
                      target: item.key,
                      type: 'tabPress',
                    })

                    if (!(focused || event.defaultPrevented)) {
                      navigation.navigate(item.name, item.params)
                    }
                  }}
                  style={styles.tab}
                >
                  {icon ? (
                    <Icon
                      name={icon}
                      uniProps={(theme) => ({
                        tintColor:
                          theme.colors[focused ? 'accent' : 'gray'].accentAlpha,
                      })}
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
      </Animated.View>
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
          paddingHorizontal: theme.space[4],
        },
      },
    },
  },
}))

const icons = {
  '(home)': 'house',
  '(notifications)': 'bell',
  '(profile)': 'person.crop.circle',
  '(search)': 'magnifyingglass',
  '(settings)': 'gearshape',
} as const satisfies Record<BottomTab, SFSymbol>
