import { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
import { Refreshing } from '~/components/common/refreshing'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { CommunitiesList } from '~/components/communities/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { CommunitiesTab } from '~/types/community'

export function CommunitiesScreen() {
  const t = useTranslations('screen.communities')

  const { styles, theme } = useStyles(stylesheet)

  const {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefreshing,
    refetch,
    users,
  } = useCommunities()

  const routes = useRef(
    CommunitiesTab.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

  const [index, setIndex] = useState(0)

  const props = {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } as const

  return (
    <>
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

          return <CommunitiesList {...props} communities={users} key="users" />
        }}
        renderTabBar={({ position }) => (
          <View pb="4" px="3" style={styles.tabs}>
            <SegmentedControl
              items={routes.current.map(({ title }) => title)}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        )}
      />

      {isRefreshing ? (
        <Refreshing offset={theme.space[7] + theme.space[4]} />
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  tabs: {
    backgroundColor: theme.colors.gray[1],
  },
}))
