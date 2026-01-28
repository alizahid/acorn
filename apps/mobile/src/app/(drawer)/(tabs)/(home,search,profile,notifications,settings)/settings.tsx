import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
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
          icon={<Icon name="gearshape" />}
          label={t('preferences')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/preferences',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="hand.tap" />}
          label={t('gestures')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/gestures',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="swatchpalette" />}
          label={t('appearance')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/appearance',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="slider.horizontal.3" />}
          label={t('defaults')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/defaults',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="line.3.horizontal.decrease" />}
          label={t('filters')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/filters',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="arrow.up.arrow.down" />}
          label={t('sort')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/sort',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="externaldrive" />}
          label={t('cache')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/cache',
            })
          }}
        />
      </Menu.Root>

      <Updater />
    </ScrollView>
  )
}
