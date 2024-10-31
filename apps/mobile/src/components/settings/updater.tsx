import * as Updates from 'expo-updates'
import { useRef, useState } from 'react'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'

export function Updater() {
  const t = useTranslations('component.settings.updater')

  const updates = Updates.useUpdates()

  const timer = useRef<NodeJS.Timeout>()

  const [nothing, setNothing] = useState<boolean>()

  return (
    <Button
      label={t(
        nothing
          ? 'nothing'
          : updates.isChecking
            ? 'checking'
            : updates.isDownloading
              ? 'downloading'
              : updates.isUpdatePending
                ? 'apply'
                : updates.isUpdateAvailable
                  ? 'download'
                  : 'check',
      )}
      loading={updates.isChecking || updates.isDownloading}
      onPress={async () => {
        setNothing(false)

        if (updates.isUpdatePending) {
          void Updates.reloadAsync()
        } else {
          if (timer.current) {
            clearTimeout(timer.current)
          }

          const update = await Updates.checkForUpdateAsync()

          if (update.isAvailable) {
            void Updates.fetchUpdateAsync()
          } else {
            setNothing(true)

            timer.current = setTimeout(() => {
              setNothing(undefined)
            }, 3_000)
          }
        }
      }}
    />
  )
}
