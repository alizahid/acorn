import { Image } from 'expo-image'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SettingsMenu } from '~/components/settings/menu'
import { queryClient } from '~/lib/query'

export function SettingsCacheScreen() {
  const t = useTranslations('screen.settings.cache')

  const { theme } = useStyles()

  return (
    <SettingsMenu
      items={[
        {
          icon: {
            color: theme.colors.red.a9,
            name: 'HardDrives',
          },
          label: t('menu.query'),
          onPress() {
            queryClient.clear()
          },
        },
        {
          icon: {
            color: theme.colors.red.a9,
            name: 'Image',
          },
          label: t('menu.image'),
          async onPress() {
            await Image.clearDiskCache()
          },
        },
      ]}
    />
  )
}
