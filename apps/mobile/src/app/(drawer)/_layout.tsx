import { useSegments } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { last } from 'lodash'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { HomeDrawer } from '~/components/home/drawer'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

export default function Layout() {
  const segments = useSegments()

  const { fullscreenDrawer, stickyDrawer, themeOled, themeTint } =
    usePreferences(
      useShallow((s) => ({
        fullscreenDrawer: s.fullscreenDrawer,
        stickyDrawer: s.stickyDrawer,
        themeOled: s.themeOled,
        themeTint: s.themeTint,
      })),
    )

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  return (
    <Drawer
      drawerContent={HomeDrawer}
      screenOptions={{
        configureGestureHandler(gesture) {
          if (fullscreenDrawer) {
            return gesture.hitSlop({
              left: 1000,
            })
          }

          return gesture
        },
        drawerStyle: styles.drawer,
        drawerType: iPad ? (stickyDrawer ? 'permanent' : 'slide') : 'front',
        headerShown: false,
        overlayColor: styles.overlay.backgroundColor,
        swipeEnabled: fullscreenDrawer
          ? segments.includes('(home)' as never)
          : last(segments) === '(home)',
      }}
    >
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  drawer: {
    backgroundColor: theme.colors.gray.bgAlt,
    borderRightColor: theme.colors.gray.border,
    variants: {
      iPad: {
        true: {
          borderRightWidth: StyleSheet.hairlineWidth,
          width: runtime.screen.width * 0.3,
        },
      },
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bgAlt,
        },
      },
    },
  },
  overlay: {
    backgroundColor: theme.colors.gray.borderAlpha,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].overlay,
        },
      },
    },
  },
  search: {
    marginTop: runtime.insets.top,
  },
}))
