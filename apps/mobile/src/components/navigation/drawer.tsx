import { Portal } from '@gorhom/portal'
import { type ReactNode, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { glass, iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'

import { IconButton } from '../common/icon/button'
import { Text } from '../common/text'
import { CommunitiesList } from '../communities/list'
import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'

type Props = {
  children: ReactNode
}

export function Drawer({ children }: Props) {
  const t = useTranslations('component.navigation.drawer')
  const a11y = useTranslations('a11y')

  const translate = useSharedValue(1)

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

  useEffect(() => {
    cancelAnimation(translate)

    translate.set(withTiming(open ? 0 : 1, {}))
  }, [open, translate])

  const style = useAnimatedStyle(() => ({
    inset: 0,
    position: 'absolute',
    transform: [
      {
        translateX: `${translate.get() * 100 * -1.1}%`,
      },
    ],
  }))

  const Main = glass ? GlassView : BlurView

  return (
    <View style={styles.main}>
      <Portal>
        <Animated.View pointerEvents="box-none" style={style}>
          {open ? (
            <Pressable
              onPress={() => {
                setOpen(false)
              }}
              style={styles.overlay}
            />
          ) : null}

          <Main intensity={75} style={styles.drawer} tint="systemMaterial">
            <View style={styles.header}>
              <Text weight="bold">{t('title')}</Text>

              <IconButton
                icon="sidebar.leading"
                label={a11y('toggleSidebar')}
                onPress={() => {
                  setOpen(false)
                }}
                weight="medium"
              />
            </View>

            <CommunitiesList
              drawer
              onPress={() => {
                setOpen(false)
              }}
              style={styles.content}
            />
          </Main>
        </Animated.View>
      </Portal>

      {children}
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flex: 1,
  },
  drawer: iPad
    ? {
        borderCurve: 'continuous',
        borderRadius: theme.radius[6] * 2,
        inset: theme.space[4],
        position: 'absolute',
        width: 300,
      }
    : {
        inset: -10,
        padding: 10,
        paddingTop: runtime.insets.top + 1,
        position: 'absolute',
      },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: theme.space[4],
    marginTop: iPad ? runtime.insets.top : undefined,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    inset: 0,
    position: 'absolute',
  },
}))
