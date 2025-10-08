import { useSegments } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { last } from 'lodash'
import { StyleSheet } from 'react-native-unistyles'

import { HomeDrawer } from '~/components/home/drawer'
import { useStageManager } from '~/hooks/stage-manager'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

export default function Layout() {
  const segments = useSegments()

  const { fullscreenDrawer, stickyDrawer, themeOled, themeTint } =
    usePreferences()

  styles.useVariants({
    iPad,
    oled: themeOled,
    sticky: stickyDrawer,
    tint: themeTint,
  })

  const stageManager = useStageManager()

  return (
    <Drawer
      drawerContent={(props) => <HomeDrawer {...props} />}
      screenOptions={{
        configureGestureHandler(gesture) {
          if (fullscreenDrawer) {
            return gesture.hitSlop({ left: 1000 })
          }

          return gesture
        },
        drawerStyle: styles.drawer,
        drawerType:
          iPad && !stageManager && stickyDrawer ? 'permanent' : 'slide',
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
        },
      },
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      sticky: {
        true: {},
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
