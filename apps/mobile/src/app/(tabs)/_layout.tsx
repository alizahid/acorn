import { Tabs } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Header } from '~/components/navigation/header'
import { TabBar } from '~/components/navigation/tab-bar'
import { TopIntervalMenu } from '~/components/posts/interval'
import { FeedSortMenu } from '~/components/posts/sort'
import { FeedTypeMenu } from '~/components/posts/type'
import { AccountSwitchCard } from '~/components/users/switch'
import { usePreferences } from '~/stores/preferences'

export default function Layout() {
  const t = useTranslations('tab')

  const { feedType, intervalFeedPosts, sortFeedPosts, update } =
    usePreferences()

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerLeft: () => (
            <FeedTypeMenu
              hideLabel
              onChange={(next) => {
                update({
                  feedType: next,
                })
              }}
              value={feedType}
            />
          ),
          headerRight: () => (
            <>
              <FeedSortMenu
                hideLabel
                onChange={(next) => {
                  update({
                    sortFeedPosts: next,
                  })
                }}
                value={sortFeedPosts}
              />

              {sortFeedPosts === 'top' ? (
                <TopIntervalMenu
                  hideLabel
                  onChange={(next) => {
                    update({
                      intervalFeedPosts: next,
                    })
                  }}
                  value={intervalFeedPosts}
                />
              ) : null}
            </>
          ),
          tabBarIcon: (props) => (
            <Icon {...props} name="House" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="MagnifyingGlass" weight="duotone" />
          ),
          title: t('search.title'),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          headerRight: () => <AccountSwitchCard />,
          tabBarIcon: (props) => (
            <Icon {...props} name="UserCircle" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="UsersFour" weight="duotone" />
          ),
          title: t('communities.title'),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="GearSix" weight="duotone" />
          ),
          title: t('settings.title'),
        }}
      />
    </Tabs>
  )
}
