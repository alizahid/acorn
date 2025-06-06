import { useRouter } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Menu } from '~/components/common/menu'
import { AboutCard } from '~/components/settings/about'
import { Updater } from '~/components/settings/updater'
import { useList } from '~/hooks/list'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.settings.settings')

  const listProps = useList()

  return (
    <Menu
      footer={<Updater />}
      header={<AboutCard />}
      items={[
        {
          arrow: true,
          icon: {
            name: 'GearSix',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('preferences'),
          onPress() {
            router.push({
              pathname: '/settings/preferences',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'HandSwipeLeft',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('gestures'),
          onPress() {
            router.push({
              pathname: '/settings/gestures',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'Palette',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('appearance'),
          onPress() {
            router.push({
              pathname: '/settings/appearance',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'SlidersHorizontal',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('defaults'),
          onPress() {
            router.push({
              pathname: '/settings/defaults',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'Funnel',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('filters'),
          onPress() {
            router.push({
              pathname: '/settings/filters',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'SortAscending',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('sort'),
          onPress() {
            router.push({
              pathname: '/settings/sort',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'HardDrives',
            type: 'icon',
            weight: 'duotone',
          },
          label: t('cache'),
          onPress() {
            router.push({
              pathname: '/settings/cache',
            })
          },
        },
      ]}
      listProps={listProps}
    />
  )
}
