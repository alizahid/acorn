import { type BottomTabBarProps } from 'expo-router/tabs'
import { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { glass } from '~/lib/common'

import { Icon, type IconName } from '../common/icon'
import { Pressable } from '../common/pressable'
import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'

type Props = BottomTabBarProps

export function TabBar({ navigation, state }: Props) {
  const translate = useSharedValue(0)

  styles.useVariants({
    glass,
  })

  useEffect(() => {
    translate.set(
      withTiming(state.index * styles.item.width, {
        duration: 150,
      }),
    )
  }, [translate.set, state.index])

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translate.get(),
      },
    ],
  }))

  const Component = glass ? GlassView : BlurView

  return (
    <Component isInteractive style={styles.main}>
      <Animated.View style={[styles.mask, style]} />

      {state.routes.map((route, index) => {
        const selected = index === state.index

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

              if (!(selected || event.defaultPrevented)) {
                navigation.navigate(route.name, route.params)
              }
            }}
            style={styles.item}
          >
            <Icon
              name={icons[route.name]}
              uniProps={(theme) => ({
                color: selected
                  ? theme.colors.accent.contrast
                  : theme.colors.gray.text,
              })}
            />
          </Pressable>
        )
      })}
    </Component>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  item: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
    width: theme.space[9],
  },
  main: {
    alignSelf: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom: runtime.insets.bottom,
    flexDirection: 'row',
    position: 'absolute',
    variants: {
      glass: {
        false: {
          overflow: 'hidden',
        },
      },
    },
  },
  mask: {
    backgroundColor: theme.colors.accent.accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    height: theme.space[8] - 4,
    left: 2,
    position: 'absolute',
    top: 2,
    width: theme.space[9] - 4,
  },
}))

const icons: Record<string, IconName> = {
  '(home)': 'house',
  '(notifications)': 'bell',
  '(profile)': 'user-circle',
  '(search)': 'magnifying-glass',
  '(settings)': 'gear-six',
}
