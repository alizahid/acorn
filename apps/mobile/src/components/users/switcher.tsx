import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Modal, StyleSheet } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useAuth } from '~/stores/auth'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'
import { SheetHeader } from '../sheets/header'

export function UserSwitcher() {
  const router = useRouter()

  const t = useTranslations('component.users.switcher')

  const { accountId, accounts, removeAccount, setAccount } = useAuth()

  const { styles } = useStyles(stylesheet)

  const [open, setOpen] = useState(false)

  return (
    <>
      <HeaderButton
        icon="UserSwitch"
        onPress={() => {
          setOpen(true)
        }}
      />

      <Modal animationType="fade" transparent visible={open}>
        <View align="center" justify="center" style={styles.main}>
          <Pressable
            onPress={() => {
              setOpen(false)
            }}
            style={styles.overlay}
          />

          <View style={styles.content}>
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

                    setOpen(false)
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
                renderLeftActions={() => null}
                renderRightActions={() => (
                  <HeaderButton
                    contrast
                    icon="Trash"
                    onPress={() => {
                      removeAccount(account.id)
                    }}
                  />
                )}
              >
                <Pressable
                  onPress={() => {
                    if (account.id !== accountId) {
                      setAccount(account.id)
                    }

                    setOpen(false)
                  }}
                  p="3"
                  style={[
                    styles.item,
                    account.id === accountId && styles.selected,
                  ]}
                >
                  <Text weight="medium">{account.id}</Text>
                </Pressable>
              </Swipeable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    backgroundColor: theme.colors.gray[1],
    borderCurve: 'continuous',
    borderRadius: theme.radius[5],
    overflow: 'hidden',
    width: runtime.screen.width - theme.space[6],
  },
  delete: {
    backgroundColor: theme.colors.red.a9,
  },
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
  item: {
    backgroundColor: theme.colors.gray[1],
  },
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray.a6,
  },
  selected: {
    backgroundColor: theme.colors.accent[5],
  },
}))
