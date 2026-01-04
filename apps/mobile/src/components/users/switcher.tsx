import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useTranslations } from 'use-intl'

import { mitter } from '~/lib/mitt'
import { useAuth } from '~/stores/auth'

import { IconButton } from '../common/icon/button'
import { Sheet } from '../common/sheet'
import { Text } from '../common/text'
import { View } from '../common/view'
import { AccountCard } from './account'

export function AccountSwitcher() {
  const router = useRouter()

  const t = useTranslations('component.users.switcher')
  const a11y = useTranslations('a11y')

  const { accountId, accounts, remove, set } = useAuth()

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
            color="green"
            icon="plus.circle"
            label={a11y('addAccount')}
            onPress={() => {
              router.navigate({
                params: {
                  mode: 'dismissible',
                },
                pathname: '/sign-in',
              })
            }}
          />
        }
        title={t('title')}
      />

      <FlatList
        data={accounts}
        ListFooterComponent={
          <View p="4">
            <Text align="center" size="2">
              {t('description')}
            </Text>
          </View>
        }
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
    </Sheet.Root>
  )
}
