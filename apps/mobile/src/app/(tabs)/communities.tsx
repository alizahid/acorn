import React from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { CommunitiesHeader } from '~/components/communities/header'
import { CommunitiesList } from '~/components/communities/list'
import { useCommunities } from '~/hooks/queries/communities/communities'

export default function Screen() {
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

  const props = {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } as const

  return (
    <Tabs.Container
      headerContainerStyle={styles.header}
      lazy
      renderTabBar={({ indexDecimal, onTabPress }) => (
        <CommunitiesHeader offset={indexDecimal} onChange={onTabPress} />
      )}
      revealHeaderOnScroll
    >
      <Tabs.Tab name="communities">
        <CommunitiesList {...props} communities={communities} tabs />
      </Tabs.Tab>

      <Tabs.Tab name="users">
        <CommunitiesList {...props} communities={users} key="users" tabs />
      </Tabs.Tab>
    </Tabs.Container>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    shadowColor: 'transparent',
  },
  main: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: theme.colors.gray[1],
  },
}))
