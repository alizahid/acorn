import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { glass } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { useAuth } from '~/stores/auth'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Sheet } from '../common/sheet'
import { Text } from '../common/text'
import { AccountCard } from './account'

export function AccountSwitcher() {
  const router = useRouter()

  const t = useTranslations('component.users.switcher')
  const a11y = useTranslations('a11y')

  const { accountId, accounts, remove, set } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
      accounts: state.accounts,
      remove: state.remove,
      set: state.set,
    })),
  )

  const sheet = useRef<Sheet>(null)

  useEffect(() => {
    mitter.on('switch-account', () => {
      sheet.current?.present()
    })

    return () => {
      mitter.off('switch-account')
    }
  }, [])

  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Header
        right={
          <IconButton
            accessibilityLabel={a11y('addAccount')}
            onPress={async () => {
              await sheet.current?.dismiss()

              router.navigate({
                params: {
                  mode: 'dismissible',
                },
                pathname: '/sign-in',
              })
            }}
            size={glass ? '9' : '8'}
          >
            <Icon
              name="plus-bold"
              uniProps={(theme) => ({
                color: theme.colors.green.accent,
              })}
            />
          </IconButton>
        }
        style={styles.header}
        title={t('title')}
      />

      <FlatList
        contentContainerStyle={styles.content}
        data={accounts}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            key={item.id}
            onChange={(id) => {
              set(id)
            }}
            onClose={() => {
              sheet.current?.dismiss()
            }}
            onRemove={(id) => {
              remove(id)
            }}
            selected={accountId}
          />
        )}
        scrollEnabled={false}
      />

      <Text align="center" m="4" size="2">
        {t('description')}
      </Text>

      <Sheet.BottomInset />
    </Sheet.Root>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: 1,
  },
  header: {
    height: theme.space[glass ? 9 : 8],
  },
}))
