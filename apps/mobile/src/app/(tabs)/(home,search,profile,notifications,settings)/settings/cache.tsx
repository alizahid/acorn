import { Image } from 'expo-image'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { db } from '~/db'
import { useListProps } from '~/hooks/list'
import { queryClient } from '~/lib/query'
import { space } from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.cache')

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
  })

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Label>{t('data.title')}</Menu.Label>

        <Menu.Button
          description={t('data.query.description')}
          icon={
            <Icon
              name="database"
              uniProps={(theme) => ({
                color: theme.colors.red.accent,
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
              name="images"
              uniProps={(theme) => ({
                color: theme.colors.red.accent,
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
                color: theme.colors.red.accent,
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
              name="arrows-in-line-vertical"
              uniProps={(theme) => ({
                color: theme.colors.red.accent,
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
              name="arrows-down-up"
              uniProps={(theme) => ({
                color: theme.colors.red.accent,
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
