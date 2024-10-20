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

  const { accountId, accounts, order, removeAccount, setAccount } = useAuth()

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
          />
        }
        style={styles.modal(accounts.length)}
        title={t('title')}
        visible={visible}
      >
        {accounts.map((account, index) => (
          <Swipeable
            containerStyle={styles.swipeable}
            key={account.id}
            renderLeftActions={() =>
              index > 0 ? (
                <HeaderButton
                  contrast
                  icon="ArrowUp"
                  onPress={() => {
                    order(account.id, 'up')
                  }}
                  weight="bold"
                />
              ) : index < accounts.length - 1 ? (
                <HeaderButton
                  contrast
                  icon="ArrowDown"
                  onPress={() => {
                    order(account.id, 'down')
                  }}
                  weight="bold"
                />
              ) : null
            }
            renderRightActions={() => (
              <HeaderButton
                contrast
                icon="Trash"
                onPress={() => {
                  removeAccount(account.id)
                }}
                style={styles.delete}
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
  delete: {
    backgroundColor: theme.colors.red.a9,
  },
  item: {
    backgroundColor: theme.colors.gray[1],
  },
  modal: (count: number) => ({
    minHeight: 44 * (count + 2),
  }),
  selected: {
    backgroundColor: theme.colors.accent[5],
  },
  swipeable: {
    backgroundColor: theme.colors.accent.a9,
  },
}))
