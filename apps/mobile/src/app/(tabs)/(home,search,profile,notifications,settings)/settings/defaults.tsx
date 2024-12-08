import { useRouter } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Menu } from '~/components/common/menu'
import { useList } from '~/hooks/list'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.settings.defaults')

  const listProps = useList()

  return (
    <Menu
      items={[
        {
          arrow: true,
          icon: {
            name: 'MagnifyingGlass',
            type: 'icon',
          },
          label: t('searchTabs.title'),
          onPress() {
            router.navigate({
              pathname: '/settings/defaults/search-tabs',
            })
          },
        },
        {
          arrow: true,
          icon: {
            name: 'HandSwipeLeft',
            type: 'icon',
          },
          label: t('drawerSections.title'),
          onPress() {
            router.navigate({
              pathname: '/settings/defaults/drawer-sections',
            })
          },
        },
      ]}
      listProps={listProps}
    />
  )
}
