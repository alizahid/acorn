import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
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

  const { styles, theme } = useStyles(stylesheet)

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
        left={
          <HeaderButton
            color="green"
            icon="PlusCircle"
            onPress={() => {
              router.push('/sign-in?mode=dismissible')
            }}
            style={styles.item}
          />
        }
        onClose={() => {
          setVisible(false)
        }}
        style={styles.modal(accounts.length)}
        title={t('title')}
        visible={visible}
      >
        {accounts.map((account) => (
          <View
            key={account.id}
            style={[styles.item, account.id === accountId && styles.selected]}
          >
            <Pressable
              onPress={() => {
                if (account.id !== accountId) {
                  setAccount(account.id)
                }

                setVisible(false)
              }}
              style={styles.account}
            >
              <Text weight="medium">{account.id}</Text>
            </Pressable>

            <HeaderButton
              color="red"
              icon="Trash"
              onPress={() => {
                removeAccount(account.id)
              }}
              size={theme.space[4]}
            />
          </View>
        ))}
      </Modal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  account: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[3],
  },
  item: {
    flexDirection: 'row',
  },
  modal: (count: number) => ({
    minHeight: 44 * (count + 3),
  }),
  selected: {
    backgroundColor: theme.colors.accent.a5,
  },
}))
