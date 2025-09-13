import { useFocusEffect, useNavigation } from 'expo-router'
import { useCallback } from 'react'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { NotificationsList } from '~/components/inbox/notifications'
import { useList } from '~/hooks/list'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'
import { useInbox } from '~/hooks/queries/user/inbox'

export default function Screen() {
  const navigation = useNavigation()

  const a11y = useTranslations('a11y')

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    notifications,
    refetch,
  } = useInbox()

  const { isPending, markAll } = useMarkAllAsRead()

  const listProps = useList()

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="checkmark.circle.fill"
            label={a11y('clearNotifications')}
            loading={isPending}
            onPress={() => {
              markAll()
            }}
          />
        ),
      })
    }, [a11y, isPending, markAll, navigation.setOptions]),
  )

  return (
    <NotificationsList
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      listProps={listProps}
      notifications={notifications}
      refetch={refetch}
    />
  )
}
