import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { CommunityAbout } from '~/components/communities/about'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useSorting } from '~/hooks/sorting'
import { CommunityTab } from '~/types/community'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export function CommunityScreen() {
  const router = useRouter()
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.community')

  const { styles, theme } = useStyles(stylesheet)

  const { sorting, update } = useSorting(params.name)

  const routes = useRef(
    CommunityTab.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

  const [index, setIndex] = useState(0)

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
        if (route.key === 'posts') {
          return (
            <PostList
              community={params.name}
              header={
                <View direction="row">
                  <TextBox
                    left={
                      <Icon
                        color={theme.colors.gray.a9}
                        name="MagnifyingGlass"
                        style={styles.searchIcon}
                      />
                    }
                    onSubmitEditing={(event) => {
                      const query = event.nativeEvent.text

                      if (query.length > 2) {
                        router.navigate({
                          params: {
                            name: params.name,
                            query,
                          },
                          pathname: '/communities/[name]/search',
                        })
                      }
                    }}
                    placeholder={t('search.placeholder')}
                    returnKeyType="search"
                    style={styles.search}
                    styleContent={styles.searchContent}
                  />

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
              refreshing={{
                header: false,
                inset: false,
              }}
              sort={sorting.sort}
            />
          )
        }

        return <CommunityAbout name={params.name} />
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
  )
}

const stylesheet = createStyleSheet((theme) => ({
  search: {
    flexGrow: 1,
  },
  searchContent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  searchIcon: {
    marginLeft: theme.space[3],
  },
  tabs: {
    backgroundColor: theme.colors.gray[1],
  },
}))
