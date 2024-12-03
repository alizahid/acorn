import { Image } from 'expo-image'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Menu } from '~/components/common/menu'
import { useList } from '~/hooks/list'
import { clearCollapsed } from '~/lib/db/collapsed'
import { clearHidden } from '~/lib/db/hidden'
import { clearHistory } from '~/lib/db/history'
import { clearSorting } from '~/lib/db/sorting'
import { queryClient } from '~/lib/query'

export default function Screen() {
  const t = useTranslations('screen.settings.cache')

  const { theme } = useStyles()

  const listProps = useList()

  return (
    <Menu
      items={[
        {
          description: t('menu.query.description'),
          icon: {
            color: theme.colors.red.a9,
            name: 'HardDrives',
            type: 'icon',
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
            type: 'icon',
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
            type: 'icon',
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
            type: 'icon',
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
            type: 'icon',
          },
          label: t('menu.hidden.label'),
          async onPress() {
            await clearHidden()
          },
        },
        {
          icon: {
            color: theme.colors.red.a9,
            name: 'SortAscending',
            type: 'icon',
          },
          label: t('menu.sorting'),
          async onPress() {
            await clearSorting()
          },
        },
      ]}
      listProps={listProps}
    />
  )
}
