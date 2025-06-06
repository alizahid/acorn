import { useSegments } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { last } from 'lodash'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HomeDrawer } from '~/components/home/drawer'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

export default function Layout() {
  const segments = useSegments()

  const { stickyDrawer, themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <Drawer
      drawerContent={(props) => <HomeDrawer {...props} />}
      screenOptions={{
        drawerStyle: styles.drawer(stickyDrawer, themeOled, themeTint),
        drawerType: iPad && stickyDrawer ? 'permanent' : 'slide',
        headerShown: false,
        overlayColor: styles.overlay(themeOled).backgroundColor,
        swipeEnabled: last(segments) === '(home)',
      }}
    >
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  drawer: (sticky: boolean, oled: boolean, tint: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[tint ? 'accent' : 'gray'].bgAlt,
    borderRightColor: theme.colors.gray.border,
    borderRightWidth: iPad ? runtime.hairlineWidth : undefined,
    maxWidth: iPad && sticky ? 300 : undefined,
  }),
  overlay: (oled: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].overlay
      : theme.colors.gray.borderAlpha,
  }),
  search: {
    marginTop: runtime.insets.top,
  },
}))
