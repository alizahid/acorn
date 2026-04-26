import { Drawer } from 'expo-router/drawer'
import { useMemo } from 'react'
import { type ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { HomeDrawer } from '~/components/home/drawer'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

export default function Layout() {
  const frame = useSafeAreaFrame()

  const { theme } = useUnistyles()

  const { fullscreenDrawer, stickyDrawer, themeOled } = usePreferences([
    'fullscreenDrawer',
    'stickyDrawer',
    'themeOled',
  ])

  const drawerStyle = useMemo<ViewStyle>(() => {
    if (iPad && stickyDrawer) {
      return {
        borderRightColor: theme.colors.gray.border,
        borderRightWidth: StyleSheet.hairlineWidth,
        width: frame.width * 0.3,
      }
    }

    return {}
  }, [frame.width, stickyDrawer, theme.colors.gray.border])

  const overlayColor = useMemo(() => {
    if (themeOled) {
      return oledTheme[theme.variant].overlay
    }

    return theme.colors.gray.borderAlpha
  }, [theme.colors.gray.borderAlpha, theme.variant, themeOled])

  return (
    <Drawer
      drawerContent={HomeDrawer}
      screenOptions={{
        drawerStyle,
        drawerType: iPad ? (stickyDrawer ? 'permanent' : 'slide') : 'front',
        headerShown: false,
        overlayColor,
        swipeEdgeWidth: fullscreenDrawer ? frame.width : undefined,
        swipeEnabled: fullscreenDrawer,
      }}
    >
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  )
}
