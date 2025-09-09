import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { useTranslations } from 'use-intl'

import { mitter } from '~/lib/mitt'
import { useAuth } from '~/stores/auth'

import { IconButton } from '../common/icon/button'
import { Sheet } from '../common/sheet'
import { AccountCard } from './account'

export function AccountSwitcher() {
  const router = useRouter()

  const t = useTranslations('component.users.switcher')
  const a11y = useTranslations('a11y')

  const { accountId, accounts, removeAccount, reorder, setAccount } = useAuth()

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
            icon={{
              color: 'green',
              name: 'PlusCircle',
            }}
            label={a11y('addAccount')}
            onPress={() => {
              router.push({
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

      <ReorderableList
        data={accounts}
        onReorder={(event) => {
          const next = reorderItems(accounts, event.from, event.to)

          reorder(next)
        }}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            key={item.id}
            onChange={(id) => {
              setAccount(id)
            }}
            onClose={() => {
              sheet.current?.dismiss()
            }}
            onRemove={(id) => {
              removeAccount(id)
            }}
            selected={accountId}
          />
        )}
        scrollEnabled={false}
      />
    </Sheet.Root>
  )
}
