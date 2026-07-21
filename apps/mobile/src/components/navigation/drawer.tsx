import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { Drawer as DrawerLayout } from 'react-native-drawer-layout'
import { StyleSheet } from 'react-native-unistyles'

import { iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'

import { CommunitiesList } from '../communities/list'

type Props = {
  children: ReactNode
}

export function Drawer({ children }: Props) {
  styles.useVariants({
    iPad,
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
      drawerPosition={iPad ? 'left' : 'right'}
      drawerStyle={styles.drawer}
      drawerType={iPad ? 'permanent' : 'slide'}
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
    variants: {
      iPad: {
        true: {
          borderRightColor: theme.colors.gray.border,
          borderRightWidth: 1,
          width: 300,
        },
      },
    },
  },
  main: {
    flex: 1,
    marginTop: runtime.insets.top,
  },
}))
