import { type ReactNode, useEffect, useState } from 'react'
import { Drawer as DrawerLayout } from 'react-native-drawer-layout'
import { StyleSheet } from 'react-native-unistyles'

import { mitter } from '~/lib/mitt'

import { CommunitiesList } from '../communities/list'

type Props = {
  children: ReactNode
}

export function Drawer({ children }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    mitter.on('drawer-toggle', () => {
      setOpen((previous) => !previous)
    })

    mitter.on('drawer-open', () => {
      setOpen(true)
    })

    mitter.on('drawer-close', () => {
      setOpen(false)
    })

    return () => {
      mitter.off('drawer-toggle')
      mitter.off('drawer-open')
      mitter.off('drawer-close')
    }
  }, [])

  return (
    <DrawerLayout
      drawerPosition="right"
      drawerStyle={styles.drawer}
      drawerType="slide"
      onClose={() => {
        setOpen(false)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      open={open}
      renderDrawerContent={() => (
        <CommunitiesList
          drawer
          onPress={() => {
            setOpen(false)
          }}
          style={styles.content}
        />
      )}
    >
      {children}
    </DrawerLayout>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flex: 1,
    marginTop: runtime.insets.top,
  },
  drawer: {
    backgroundColor: theme.colors.ui.bg,
  },
}))
