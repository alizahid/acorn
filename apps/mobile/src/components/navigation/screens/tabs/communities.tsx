import React from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

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
        <View style={styles.tabs}>
          <SegmentedControl
            items={CommunityTab.map((item) => t(`tabs.${item}`))}
            offset={indexDecimal}
            onChange={(index) => {
              const next = CommunityTab[index]

              if (next) {
                onTabPress(next)
              }
            }}
          />
        </View>
      )}
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
  tabs: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[3],
  },
}))
