import { usePathname, useSegments } from 'expo-router'
import { type ReactNode, useState } from 'react'
import { Drawer } from 'react-native-drawer-layout'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { CommunitiesList } from '../communities/list'
import { CommunitySearchBox } from '../communities/search-box'

type Props = {
  children: ReactNode
}

export function HomeDrawer({ children }: Props) {
  const path = usePathname()
  const segments = useSegments()

  const { stickyDrawer, themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const listProps = useList({
    header: false,
  })

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <Drawer
      drawerStyle={styles.drawer(stickyDrawer, themeOled, themeTint)}
      drawerType={iPad && stickyDrawer ? 'permanent' : 'front'}
      onClose={() => {
        setOpen(false)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      open={open}
      overlayStyle={styles.overlay(themeOled)}
      renderDrawerContent={() => (
        <>
          <CommunitySearchBox onChange={setQuery} value={query} />

          <CommunitiesList
            listProps={listProps}
            onPress={() => {
              setOpen(false)
            }}
            query={query}
          />
        </>
      )}
      swipeEnabled={iPad || (segments[0] === '(home)' && path !== '/')}
    >
      {children}
    </Drawer>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  drawer: (sticky: boolean, oled: boolean, tint: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].overlay
      : theme.colors[tint ? 'accent' : 'gray'].bgAlt,
    maxWidth: iPad && sticky ? 300 : undefined,
  }),
  overlay: (oled: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].overlay
      : theme.colors.gray.borderAlpha,
  }),
}))
