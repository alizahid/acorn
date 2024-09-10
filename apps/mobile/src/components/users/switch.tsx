import { useRouter } from 'expo-router'
import { useState } from 'react'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useAuth } from '~/stores/auth'

import { Modal } from '../common/modal'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { HeaderButton } from '../navigation/header-button'

export function AccountSwitchCard() {
  const router = useRouter()

  const t = useTranslations('component.users.switch')

  const { accountId, accounts, removeAccount, setAccount } = useAuth()

  const { styles } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  return (
    <>
      <HeaderButton
        icon="UserSwitch"
        onPress={() => {
          setVisible((previous) => !previous)
        }}
      />

      <Modal
        onClose={() => {
          setVisible(false)
        }}
        right={
          <HeaderButton
            color="green"
            icon="PlusCircle"
            onPress={() => {
              router.push('/sign-in?mode=dismissible')

              setVisible(false)
            }}
            weight="bold"
          />
        }
        style={styles.modal(accounts.length)}
        title={t('title')}
        visible={visible}
      >
        {accounts.map((account) => (
          <Swipeable
            containerStyle={styles.swipeable}
            key={account.id}
            renderRightActions={() => (
              <HeaderButton
                color="red"
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

                setVisible(false)
              }}
              p="3"
              style={[styles.item, account.id === accountId && styles.selected]}
            >
              <Text weight="medium">{account.id}</Text>
            </Pressable>
          </Swipeable>
        ))}
      </Modal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  item: {
    backgroundColor: theme.colors.gray[1],
  },
  modal: (count: number) => ({
    minHeight: 44 * (count + 3),
  }),
  selected: {
    backgroundColor: theme.colors.accent[5],
  },
  swipeable: {
    backgroundColor: theme.colors.red.a9,
  },
}))
