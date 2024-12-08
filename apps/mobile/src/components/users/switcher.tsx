import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Modal, Pressable, StyleSheet } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useAuth } from '~/stores/auth'

import { Text } from '../common/text'
import { HeaderButton } from '../navigation/header-button'
import { SheetHeader } from '../sheets/header'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function UserSwitcher() {
  const frame = useSafeAreaFrame()

  const router = useRouter()

  const t = useTranslations('component.users.switcher')

  const { accountId, accounts, removeAccount, setAccount } = useAuth()

  const { styles } = useStyles(stylesheet)

  const opacity = useSharedValue(0)
  const translate = useSharedValue(frame.height)

  const [open, setOpen] = useState(false)

  const onOpen = useCallback(() => {
    setOpen(true)

    opacity.set(() => withTiming(1))
    translate.set(() => withTiming(0))
  }, [opacity, translate])

  const onClose = useCallback(() => {
    opacity.set(() => withTiming(0))

    translate.set(() =>
      withTiming(frame.height, undefined, () => {
        runOnJS(setOpen)(false)
      }),
    )
  }, [frame.height, opacity, translate])

  const main = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translate.get(),
      },
    ],
  }))

  const overlay = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  return (
    <>
      <HeaderButton
        icon="UserSwitch"
        onPress={() => {
          onOpen()
        }}
      />

      <Modal transparent visible={open}>
        <AnimatedPressable
          onPress={() => {
            onClose()
          }}
          style={[styles.overlay, overlay]}
        />

        <Animated.View style={[styles.main, main]}>
          <SheetHeader
            right={
              <HeaderButton
                color="green"
                icon="PlusCircle"
                onPress={() => {
                  router.navigate({
                    params: {
                      mode: 'dismissible',
                    },
                    pathname: '/sign-in',
                  })

                  onClose()
                }}
              />
            }
            style={styles.header}
            title={t('title')}
          />

          {accounts.map((account) => (
            <Swipeable
              containerStyle={styles.delete}
              key={account.id}
              renderLeftActions={() => (
                <HeaderButton
                  contrast
                  icon="Trash"
                  onPress={() => {
                    removeAccount(account.id)
                  }}
                />
              )}
              renderRightActions={() => null}
            >
              <Pressable
                onPress={() => {
                  if (account.id !== accountId) {
                    setAccount(account.id)
                  }

                  onClose()
                }}
                style={[
                  styles.item,
                  account.id === accountId && styles.selected,
                ]}
              >
                <Text weight="medium">{account.id}</Text>
              </Pressable>
            </Swipeable>
          ))}
        </Animated.View>
      </Modal>
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  delete: {
    backgroundColor: theme.colors.red.a9,
  },
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
  item: {
    backgroundColor: theme.colors.gray[1],
    padding: theme.space[3],
  },
  main: {
    backgroundColor: theme.colors.gray[1],
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[5],
    borderTopRightRadius: theme.radius[5],
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    paddingBottom: runtime.insets.bottom,
    position: 'absolute',
    right: 0,
    width: runtime.screen.width,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray.a7,
  },
  selected: {
    backgroundColor: theme.colors.accent[5],
  },
}))
