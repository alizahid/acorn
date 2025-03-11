import { Image } from 'expo-image'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Menu } from '~/components/common/menu'
import { db } from '~/db'
import { useList } from '~/hooks/list'
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
            color: theme.colors.red.accent,
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
            color: theme.colors.red.accent,
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
            color: theme.colors.red.accent,
            name: 'Eye',
            type: 'icon',
          },
          label: t('menu.history.label'),
          async onPress() {
            db.query
            await db.delete(db.schema.history)
          },
        },
        {
          icon: {
            color: theme.colors.red.accent,
            name: 'TreeView',
            type: 'icon',
          },
          label: t('menu.collapsed'),
          async onPress() {
            await db.delete(db.schema.collapsed)
          },
        },
        {
          icon: {
            color: theme.colors.red.accent,
            name: 'SortAscending',
            type: 'icon',
          },
          label: t('menu.sorting'),
          async onPress() {
            await db.delete(db.schema.sorting)
          },
        },
      ]}
      listProps={listProps}
    />
  )
}
