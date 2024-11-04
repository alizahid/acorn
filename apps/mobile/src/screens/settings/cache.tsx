import { Image } from 'expo-image'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Menu } from '~/components/common/menu'
import { clearCollapsed } from '~/lib/db/collapsed'
import { clearHidden } from '~/lib/db/hidden'
import { clearHistory } from '~/lib/db/history'
import { queryClient } from '~/lib/query'

export function SettingsCacheScreen() {
  const t = useTranslations('screen.settings.cache')

  const { theme } = useStyles()

  return (
    <Menu
      items={[
        {
          description: t('menu.query.description'),
          icon: {
            color: theme.colors.red.a9,
            name: 'HardDrives',
          },
          label: t('menu.query.label'),
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
            await Promise.all([
              Image.clearDiskCache(),
              Image.clearMemoryCache(),
            ])
          },
        },
        {
          description: t('menu.history.description'),
          icon: {
            color: theme.colors.red.a9,
            name: 'Eye',
          },
          label: t('menu.history.label'),
          async onPress() {
            await clearHistory()
          },
        },
        {
          icon: {
            color: theme.colors.red.a9,
            name: 'TreeView',
          },
          label: t('menu.collapsed'),
          async onPress() {
            await clearCollapsed()
          },
        },
        {
          description: t('menu.hidden.description'),
          icon: {
            color: theme.colors.red.a9,
            name: 'EyeClosed',
          },
          label: t('menu.hidden.label'),
          async onPress() {
            await clearHidden()
          },
        },
      ]}
    />
  )
}
