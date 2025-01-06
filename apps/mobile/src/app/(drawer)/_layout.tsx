import { Drawer } from 'expo-router/drawer'
import { useStyles } from 'react-native-unistyles'

import { HomeDrawer } from '~/components/home/drawer'
import { iPad } from '~/lib/common'

export default function Layout() {
  const { theme } = useStyles()

  return (
    <Drawer
      drawerContent={() => <HomeDrawer />}
      screenOptions={{
        drawerType: iPad ? 'permanent' : 'slide',
        headerShown: false,
        overlayColor: theme.colors.gray.a9,
      }}
    />
  )
}
