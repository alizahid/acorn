import { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { CommunitiesList } from '~/components/communities/list'
import { Header } from '~/components/navigation/header'
import { useList } from '~/hooks/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { CommunitiesTab } from '~/types/community'

export function CommunitiesScreen() {
  const t = useTranslations('screen.communities')

  const { theme } = useStyles()

  const { communities, isLoading, refetch, users } = useCommunities()

  const listProps = useList({
    top: theme.space[7] + theme.space[4],
  })

  const routes = useRef(
    CommunitiesTab.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

  const [index, setIndex] = useState(0)

  const props = {
    isLoading,
    listProps,
    refetch,
  } as const

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes: routes.current,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={Loading}
      renderScene={({ route }) => {
        if (route.key === 'communities') {
          return <CommunitiesList {...props} communities={communities} />
        }

        return <CommunitiesList {...props} communities={users} />
      }}
      renderTabBar={({ position }) => (
        <Header title={t('title')}>
          <View pb="4" px="3">
            <SegmentedControl
              items={routes.current.map(({ title }) => title)}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        </Header>
      )}
    />
  )
}
