import { Drawer } from 'expo-router/drawer'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HomeDrawer } from '~/components/home/drawer'
import { iPad } from '~/lib/common'

export default function Layout() {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Drawer
      drawerContent={() => <HomeDrawer />}
      screenOptions={{
        drawerType: iPad ? 'permanent' : 'slide',
        headerShown: false,
        overlayColor: theme.colors.gray.a9,
        swipeEdgeWidth: styles.main.width,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: {
    width: runtime.screen.width * 0.3,
  },
}))
