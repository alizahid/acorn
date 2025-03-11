import { usePathname } from 'expo-router'
import mitt from 'mitt'
import { type ReactNode, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { ListFlags, useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { useGestures } from '~/stores/gestures'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { CommunitiesList } from '../communities/list'
import { CommunitySearchBox } from '../communities/search-box'

export const drawer = mitt<{
  close?: unknown
  open?: unknown
  toggle?: unknown
}>()

type Props = {
  children: ReactNode
}

export function HomeDrawer({ children }: Props) {
  const path = usePathname()

  const { stickyDrawer, themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)


  const { postLeft } = useGestures()

  const listProps = useList(ListFlags.BOTTOM)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    drawer.on('open', () => {
      setOpen(true)
    })

    drawer.on('close', () => {
      setOpen(false)
    })

    drawer.on('toggle', () => {
      setOpen((previous) => !previous)
    })

    return () => {
      drawer.off('open')
      drawer.off('close')
      drawer.off('toggle')
    }
  }, [])

  const screenWidth = Dimensions.get('window').width

  return (
    <Drawer
      drawerStyle={styles.drawer(stickyDrawer, themeOled, themeTint)}
      drawerType={iPad && stickyDrawer ? 'permanent' : 'slide'}
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
      swipeEnabled={path === '/'}
      // If the left swipe post gesture is disabled, then allow opening
      // the drawer from anywhere, instead of just the left edge.
      {...(!postLeft && { swipeEdgeWidth: screenWidth })}
    >
      {children}
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
}))
