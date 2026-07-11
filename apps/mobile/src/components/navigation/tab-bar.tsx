import { type BottomTabBarProps } from '@bottom-tabs/react-navigation'
import { StyleSheet } from 'react-native-unistyles'

import { glass } from '~/lib/common'

import { Icon, type IconName } from '../common/icon'
import { Pressable } from '../common/pressable'
import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'

type Props = BottomTabBarProps

export function TabBar({ navigation, state }: Props) {
  styles.useVariants({
    glass,
  })

  const Component = glass ? GlassView : BlurView

  return (
    <Component isInteractive style={styles.main}>
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
              name={icons[route.name]?.[selected ? 'selected' : 'default']}
              uniProps={(theme) => ({
                color: selected
                  ? theme.colors.accent.accent
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
    width: theme.space[8],
  },
  main: {
    alignSelf: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.space[7],
    bottom: runtime.insets.bottom,
    flexDirection: 'row',
    paddingHorizontal: theme.space[2],
    position: 'absolute',
    variants: {
      glass: {
        false: {
          overflow: 'hidden',
        },
      },
    },
  },
}))

const icons: Record<
  string,
  {
    default: IconName
    selected: IconName
  }
> = {
  '(home)': {
    default: 'house',
    selected: 'house-fill',
  },
  '(notifications)': {
    default: 'bell',
    selected: 'bell-fill',
  },
  '(profile)': {
    default: 'user-circle',
    selected: 'user-circle-fill',
  },
  '(search)': {
    default: 'magnifying-glass',
    selected: 'magnifying-glass-fill',
  },
  '(settings)': {
    default: 'gear-six',
    selected: 'gear-six-fill',
  },
}
