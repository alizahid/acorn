import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import mitt from 'mitt'
import { useEffect, useRef } from 'react'
import ReorderableList, { reorderItems } from 'react-native-reorderable-list'
import { useTranslations } from 'use-intl'

import { useAuth } from '~/stores/auth'

import { IconButton } from '../common/icon-button'
import { SheetModal } from '../sheets/modal'
import { AccountCard } from './account'

export const switcher = mitt<{
  open?: unknown
}>()

export function UserSwitcher() {
  const router = useRouter()

  const t = useTranslations('component.users.switcher')

  const { accountId, accounts, removeAccount, reorder, setAccount } = useAuth()

  const sheet = useRef<BottomSheetModal>(null)

  useEffect(() => {
    switcher.on('open', () => {
      sheet.current?.present()
    })

    return () => {
      switcher.off('open')
    }
  }, [])

  return (
    <SheetModal
      ref={sheet}
      right={
        <IconButton
          icon={{
            color: 'green',
            name: 'PlusCircle',
          }}
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
    >
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
    </SheetModal>
  )
}
