import { Image } from 'expo-image'
import { ScrollView } from 'react-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { db } from '~/db'
import { useList } from '~/hooks/list'
import { queryClient } from '~/lib/query'

export default function Screen() {
  const t = useTranslations('screen.settings.cache')

  const listProps = useList()

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Label>{t('data.title')}</Menu.Label>

        <Menu.Button
          description={t('data.query.description')}
          icon={
            <Icon
              name="server.rack"
              uniProps={(theme) => ({
                tintColor: theme.colors.red.accent,
              })}
            />
          }
          label={t('data.query.label')}
          onPress={() => {
            queryClient.clear()
          }}
        />

        <Menu.Separator />

        <Menu.Label>{t('media.title')}</Menu.Label>

        <Menu.Button
          icon={
            <Icon
              name="photo"
              uniProps={(theme) => ({
                tintColor: theme.colors.red.accent,
              })}
            />
          }
          label={t('media.image')}
          onPress={async () => {
            await Promise.all([
              Image.clearDiskCache(),
              Image.clearMemoryCache(),
            ])
          }}
        />

        <Menu.Separator />

        <Menu.Label>{t('history.title')}</Menu.Label>

        <Menu.Button
          description={t('history.history.description')}
          icon={
            <Icon
              name="eye"
              uniProps={(theme) => ({
                tintColor: theme.colors.red.accent,
              })}
            />
          }
          label={t('history.history.label')}
          onPress={async () => {
            await db.delete(db.schema.history)
          }}
        />

        <Menu.Button
          icon={
            <Icon
              name="list.bullet.indent"
              uniProps={(theme) => ({
                tintColor: theme.colors.red.accent,
              })}
            />
          }
          label={t('history.collapsed')}
          onPress={async () => {
            await db.delete(db.schema.collapsed)
          }}
        />

        <Menu.Button
          icon={
            <Icon
              name="triangle"
              uniProps={(theme) => ({
                tintColor: theme.colors.red.accent,
              })}
            />
          }
          label={t('history.sorting')}
          onPress={async () => {
            await db.delete(db.schema.sorting)
          }}
        />
      </Menu.Root>
    </ScrollView>
  )
}
