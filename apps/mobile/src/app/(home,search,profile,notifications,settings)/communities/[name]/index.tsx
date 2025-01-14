import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { CommunityAbout } from '~/components/communities/about'
import { CommunitySearchBar } from '~/components/communities/search-bar'
import { Header } from '~/components/navigation/header'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { iPad } from '~/lib/common'
import { CommunityTab } from '~/types/community'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

const routes = CommunityTab.map((key) => ({
  key,
  title: key,
}))

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.community')

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList({
    padding: iPad ? theme.space[4] : 0,
    top: theme.space[7] + theme.space[4],
  })

  const { sorting, update } = useSorting('community', params.name)

  const [index, setIndex] = useState(0)

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={Loading}
      renderScene={({ route }) => {
        if (route.key === 'posts') {
          return (
            <PostList
              community={params.name}
              header={
                <View direction="row" style={styles.header()}>
                  <CommunitySearchBar name={params.name} />

                  <SortIntervalMenu
                    interval={sorting.interval}
                    onChange={(next) => {
                      update({
                        interval: next.interval,
                        sort: next.sort,
                      })
                    }}
                    sort={sorting.sort}
                    type="community"
                  />
                </View>
              }
              interval={sorting.interval}
              label="user"
              listProps={listProps}
              sort={sorting.sort}
            />
          )
        }

        return <CommunityAbout listProps={listProps} name={params.name} />
      }}
      renderTabBar={({ position }) => (
        <Header back title={params.name}>
          <View gap="4" pb="4" px="3">
            <SegmentedControl
              items={routes.map(({ key }) => t(`tabs.${key}`))}
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

const stylesheet = createStyleSheet((theme, runtime) => ({
  header: () => {
    if (iPad) {
      return {
        borderBottomColor: theme.colors.gray.a6,
        borderBottomWidth: runtime.hairlineWidth,
        marginBottom: theme.space[4],
        marginHorizontal: -theme.space[4],
        marginTop: -theme.space[4],
      }
    }

    return {}
  },
}))
