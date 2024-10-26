import React, { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { CommunitiesList } from '~/components/communities/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { CommunityTab } from '~/types/community'

export function CommunitiesScreen() {
  const t = useTranslations('screen.communities')

  const { styles } = useStyles(stylesheet)

  const {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    users,
  } = useCommunities()

  const routes = useRef(
    CommunityTab.map((key) => ({
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
      renderTabBar={({ position }) => {
        return (
          <View style={styles.tabs}>
            <SegmentedControl
              items={routes.current.map(({ title }) => title)}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  tabs: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[3],
  },
}))
