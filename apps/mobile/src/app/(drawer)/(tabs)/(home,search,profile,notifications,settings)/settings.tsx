import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { AboutCard } from '~/components/settings/about'
import { Updater } from '~/components/settings/updater'
import { useList } from '~/hooks/list'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.settings.settings')

  const listProps = useList()

  return (
    <ScrollView {...listProps}>
      <AboutCard />

      <Menu.Root>
        <Menu.Button
          arrow
          icon={<Icon name="GearSix" />}
          label={t('preferences')}
          onPress={() => {
            router.push({
              pathname: '/settings/preferences',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="HandSwipeLeft" />}
          label={t('gestures')}
          onPress={() => {
            router.push({
              pathname: '/settings/gestures',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="Palette" />}
          label={t('appearance')}
          onPress={() => {
            router.push({
              pathname: '/settings/appearance',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="SlidersHorizontal" />}
          label={t('defaults')}
          onPress={() => {
            router.push({
              pathname: '/settings/defaults',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="Funnel" />}
          label={t('filters')}
          onPress={() => {
            router.push({
              pathname: '/settings/filters',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="SortAscending" />}
          label={t('sort')}
          onPress={() => {
            router.push({
              pathname: '/settings/sort',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="HardDrives" />}
          label={t('cache')}
          onPress={() => {
            router.push({
              pathname: '/settings/cache',
            })
          }}
        />
      </Menu.Root>

      <Updater />
    </ScrollView>
  )
}
