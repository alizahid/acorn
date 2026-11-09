import { useRouter } from 'expo-router'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as WebBrowser from 'expo-web-browser'
import { Alert, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { Logo } from '~/components/common/logo'
import { Menu } from '~/components/common/menu'
import { AboutCard } from '~/components/settings/about'
import { Updater } from '~/components/settings/updater'
import { useListProps } from '~/hooks/list'
import { queryClient } from '~/lib/query'
import { useAuth } from '~/stores/auth'

export default function Screen() {
  const router = useRouter()

  const t = useTranslations('screen.settings.settings')

  const listProps = useListProps()

  const { accountId, remove } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
      remove: state.remove,
    })),
  )

  return (
    <ScrollView
      {...listProps}
      contentContainerStyle={[listProps.contentContainerStyle, styles.content]}
    >
      <AboutCard />

      <Menu.Root>
        <Menu.Button
          arrow
          icon={<Logo style={styles.logo} />}
          label={t('pro')}
          onPress={() => {
            router.navigate({
              pathname: '/subscribe',
            })
          }}
        />

        <Menu.Button
          arrow
          icon={<Icon name="newspaper-clipping" />}
          label={t('new')}
          onPress={() => {
            router.navigate({
              pathname: '/new',
            })
          }}
        />

        <Menu.Separator />

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

        <Menu.Separator />

        <Menu.Button
          arrow="link"
          icon={<Icon name="question" />}
          label={t('faq')}
          onPress={async () => {
            await WebBrowser.warmUpAsync()

            await WebBrowser.openBrowserAsync('https://acorn.blue/faq')
          }}
        />

        <Menu.Button
          arrow="link"
          icon={<Icon name="file-text" />}
          label={t('terms')}
          onPress={async () => {
            await WebBrowser.warmUpAsync()

            await WebBrowser.openBrowserAsync('https://acorn.blue/terms')
          }}
        />

        <Menu.Button
          arrow="link"
          icon={<Icon name="keyhole" />}
          label={t('privacy')}
          onPress={async () => {
            await WebBrowser.warmUpAsync()

            await WebBrowser.openBrowserAsync('https://acorn.blue/privacy')
          }}
        />

        {accountId ? (
          <>
            <Menu.Separator />

            <Menu.Button
              arrow="link"
              icon={
                <Icon
                  name="trash"
                  uniProps={(theme) => ({
                    color: theme.colors.red.accent,
                  })}
                />
              }
              label={t('delete.label')}
              onPress={() => {
                Alert.alert(t('delete.title'), t('delete.description'), [
                  {
                    style: 'cancel',
                    text: t('delete.cancel'),
                  },
                  {
                    onPress() {
                      remove(accountId)

                      queryClient.clear()

                      Linking.openURL('https://www.reddit.com/settings/account')
                    },
                    style: 'destructive',
                    text: t('delete.confirm'),
                  },
                ])
              }}
            />
          </>
        ) : null}
      </Menu.Root>

      <Updater />
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.space[8],
    paddingBottom: theme.space[4],
    paddingTop: theme.space[9],
  },
  logo: {
    height: theme.space[5],
    width: theme.space[5],
  },
}))
