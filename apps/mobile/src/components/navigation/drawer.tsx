import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { Drawer as DrawerLayout } from 'react-native-drawer-layout'
import { StyleSheet } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { usePreferences } from '~/stores/preferences'

import { CommunitiesList } from '../communities/list'

type Props = {
  children: ReactNode
}

export function Drawer({ children }: Props) {
  const { drawerLeft, drawerSticky } = usePreferences(
    useShallow((state) => ({
      drawerLeft: state.drawerLeft,
      drawerSticky: state.drawerSticky,
    })),
  )

  styles.useVariants({
    iPad,
    side: drawerLeft ? 'left' : 'right',
    sticky: drawerSticky,
  })

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

  const renderDrawerContent = useCallback(
    () => (
      <CommunitiesList
        contentContainerStyle={styles.content}
        drawer
        onPress={() => {
          setOpen(false)
        }}
        style={styles.main}
      />
    ),
    [],
  )

  return (
    <DrawerLayout
      drawerPosition={iPad ? 'left' : drawerLeft ? 'left' : 'right'}
      drawerStyle={styles.drawer}
      drawerType={iPad ? (drawerSticky ? 'permanent' : 'front') : 'slide'}
      onClose={() => {
        setOpen(false)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      open={open}
      renderDrawerContent={renderDrawerContent}
    >
      {children}
    </DrawerLayout>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flexGrow: 1,
  },
  drawer: {
    backgroundColor: theme.colors.gray.bg,
    compoundVariants: [
      {
        iPad: true,
        sticky: true,
        styles: {
          backgroundColor: theme.colors.gray.ui,
          width: 300,
        },
      },
    ],
    variants: {
      iPad: {
        true: {},
      },
      sticky: {
        true: {},
      },
    },
  },
  main: {
    flex: 1,
    marginTop: runtime.insets.top,
    variants: {
      side: {
        left: {
          marginLeft: runtime.insets.left,
        },
        right: {
          marginRight: runtime.insets.right,
        },
      },
    },
  },
}))
