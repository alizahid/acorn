import { Tabs, useGlobalSearchParams, useRouter } from 'expo-router'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { Header } from '~/components/navigation/header'
import { PagerHeader } from '~/components/navigation/pager'
import { TabBar } from '~/components/navigation/tab-bar'
import { SearchHeader } from '~/components/search/header'
import { AccountSwitchCard } from '~/components/users/switch'

const schema = z.object({
  communitiesType: z.coerce.number().catch(0),
})

export default function Layout() {
  const router = useRouter()

  const params = schema.parse(useGlobalSearchParams())

  const t = useTranslations('tab')

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
          tabBarIcon: (props) => (
            <Icon {...props} name="House" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          header: () => <SearchHeader />,
          tabBarIcon: (props) => (
            <Icon {...props} name="MagnifyingGlass" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        initialParams={{
          page: 0,
        }}
        name="communities"
        options={{
          header: () => (
            <PagerHeader
              active={params.communitiesType}
              items={[t('communities.communities'), t('communities.users')]}
              onChange={(index) => {
                router.setParams({
                  communitiesType: index,
                })
              }}
            />
          ),
          tabBarIcon: (props) => (
            <Icon {...props} name="UsersFour" weight="duotone" />
          ),
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
    </Tabs>
  )
}
