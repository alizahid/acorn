import Constants from 'expo-constants'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as Updates from 'expo-updates'
import { useRef, useState } from 'react'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/common/button'

import { Text } from '../common/text'
import { View } from '../common/view'

export function Updater() {
  const t = useTranslations('component.settings.updater')

  const updates = Updates.useUpdates()

  const timer = useRef<NodeJS.Timeout>(null)

  const [nothing, setNothing] = useState<boolean>()

  return (
    <View align="center" gap="4" m="6">
      <View direction="row" gap="4">
        <Text highContrast={false} variant="mono" weight="medium">
          {Updates.runtimeVersion}
        </Text>

        {Constants.expoConfig?.ios?.buildNumber ? (
          <Text highContrast={false} variant="mono">
            {Constants.expoConfig.ios.buildNumber}
          </Text>
        ) : null}

        {Updates.updateId ? (
          <Text highContrast={false} variant="mono">
            {Updates.updateId.split('-').pop()}
          </Text>
        ) : null}
      </View>

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
            Updates.reloadAsync()
          } else {
            if (timer.current) {
              clearTimeout(timer.current)
            }

            const update = await Updates.checkForUpdateAsync()

            if (update.isAvailable) {
              Updates.fetchUpdateAsync()
            } else {
              setNothing(true)

              timer.current = setTimeout(() => {
                setNothing(undefined)
              }, 3000)
            }
          }
        }}
      />
    </View>
  )
}
