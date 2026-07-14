import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu } from '~/components/common/menu'
import { AboutCard } from '~/components/settings/about'
import { Updater } from '~/components/settings/updater'
import { useListProps } from '~/hooks/list'
import { space } from '~/styles/tokens'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.settings.settings')

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[9],
    flash: false,
    header: false,
  })

  return (
    <ScrollView
      {...listProps}
      contentContainerStyle={[listProps.contentContainerStyle, styles.content]}
    >
      <AboutCard />

      <Menu.Root>
        <Menu.Button
          arrow
          icon={<Icon name="gear-six" />}
          label={t('preferences')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/preferences',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="hand-tap" />}
          label={t('gestures')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/gestures',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="swatches" />}
          label={t('appearance')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/appearance',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="sliders" />}
          label={t('defaults')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/defaults',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="funnel" />}
          label={t('filters')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/filters',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="arrows-down-up" />}
          label={t('sort')}
          onPress={() => {
            router.navigate({
              pathname: '/settings/sort',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="hard-drives" />}
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

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.space[8],
  },
}))
