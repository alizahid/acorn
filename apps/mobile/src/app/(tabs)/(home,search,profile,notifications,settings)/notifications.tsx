import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Spinner } from '~/components/common/spinner'
import { NotificationsList } from '~/components/inbox/notifications'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'

export default function Screen() {
  const a11y = useTranslations('a11y')

  const { isPending, markAll } = useMarkAllAsRead()

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <IconButton
            accessibilityLabel={a11y('clearNotifications')}
            disabled={isPending}
            header
            onPress={() => {
              markAll()
            }}
          >
            {isPending ? <Spinner /> : <Icon name="checks-bold" />}
          </IconButton>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <NotificationsList />
    </>
  )
}
