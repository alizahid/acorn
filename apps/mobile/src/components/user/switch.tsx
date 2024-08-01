import { useRouter } from 'expo-router'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useSwitch } from '~/hooks/mutations/auth/switch'
import { useAuth } from '~/stores/auth'

import { Icon } from '../common/icon'
import { Modal } from '../common/modal'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { HeaderButton } from '../navigation/header-button'

export function AccountSwitchCard() {
  const router = useRouter()

  const t = useTranslations('component.user.switch')

  const { accountId, accounts } = useAuth()
  const { switchAccount } = useSwitch()

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
        onClose={() => {
          setVisible(false)
        }}
        style={styles.modal(accounts.length)}
        title={t('title')}
        visible={visible}
      >
        {accounts.map((account) => (
          <Pressable
            key={account.id}
            onPress={() => {
              if (account.id !== accountId) {
                switchAccount(account.id)
              }

              setVisible(false)
            }}
            style={[styles.item, account.id === accountId && styles.selected]}
          >
            <Text size="2" weight="medium">
              {account.id}
            </Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => {
            router.push('/sign-in?mode=dismissible')
          }}
          style={styles.item}
        >
          <Icon
            color={theme.colors.green.a9}
            name="PlusCircle"
            size={theme.typography[2].lineHeight}
          />

          <Text size="2" weight="medium">
            Add account
          </Text>
        </Pressable>
      </Modal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[3],
  },
  modal: (count: number) => ({
    minHeight: 44 * (count + 3),
  }),
  selected: {
    backgroundColor: theme.colors.accent.a5,
  },
}))
