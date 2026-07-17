import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import fuzzysort from 'fuzzysort'
import { compact } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import {
  SectionList,
  type SectionListData,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { renderScrollComponent } from '~/hooks/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/communities/feeds'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { space } from '~/styles/tokens'
import { type Community } from '~/types/community'
import { type Feed } from '~/types/feed'
import { FeedType } from '~/types/sort'

import { Empty } from '../common/empty'
import { IconButton } from '../common/icon/button'
import { ListHeader } from '../common/list/header'
import { ListItem } from '../common/list/item'
import { RefreshControl } from '../common/refresh-control'
import { SearchBox } from '../common/search'
import { Spinner } from '../common/spinner'
import { type AlphabetItem, AlphabetList } from './alphabet'

type Section = {
  collapsed?: boolean
  collapsible: boolean
  key: string
  loading: boolean
  title?: string
}

type Item =
  | {
      data: FeedType
      key: string
      type: 'type'
    }
  | {
      data: Feed
      key: string
      type: 'feed'
    }
  | {
      data: Community
      key: string
      type: 'community'
    }
  | {
      data: Community
      key: string
      type: 'user'
    }

type Props = {
  drawer?: boolean
  onPress?: (item: Item) => void
  show?: Array<Item['type']>
  style?: StyleProp<ViewStyle>
}

export function CommunitiesList({
  drawer,
  onPress,
  show = ['community', 'feed', 'type', 'user'],
  style,
}: Props) {
  const router = useRouter()

  const t = useTranslations('component.common.type')
  const a11y = useTranslations('a11y')

  const { drawerSections } = useDefaults(
    useShallow((state) => ({
      drawerSections: state.drawerSections,
    })),
  )

  const { feeds, isLoading: loadingFeeds, refetch: refetchFeeds } = useFeeds()
  const { communities, isLoading, users, refetch } = useCommunities()

  const list = useRef<SectionList<Item, Section>>(null)

  const [query, setQuery] = useState('')

  const [collapsed, setCollapsed] = useState(new Map<string, boolean>())
  const [open, setOpen] = useState(new Map<string, boolean>())

  const sections: Array<SectionListData<Item, Section>> = useMemo(() => {
    const dataType: Array<Item> = show.includes('type')
      ? FeedType.map((item) => ({
          data: item,
          key: item,
          type: 'type',
        }))
      : []

    const dataCommunities: Array<Item> = show.includes('community')
      ? communities.map((item) => ({
          data: item,
          key: item.id,
          type: 'community',
        }))
      : []

    const dataFeeds: Array<Item> = show.includes('feed')
      ? feeds.map((item) => ({
          data: item,
          key: item.id,
          type: 'feed',
        }))
      : []

    const dataUsers: Array<Item> = show.includes('user')
      ? users.map((item) => ({
          data: item,
          key: item.id,
          type: 'user',
        }))
      : []

    if (query.length > 0) {
      const resultsCommunities = fuzzysort.go(query, dataCommunities, {
        key: 'data.name',
      })

      const resultsFeeds = fuzzysort.go(query, dataFeeds, {
        key: 'data.name',
      })

      const resultsUsers = fuzzysort.go(query, dataUsers, {
        key: 'data.name',
      })

      return [
        {
          collapsed: false,
          collapsible: false,
          data: resultsFeeds.map((result) => result.obj),
          key: 'feeds',
          loading: false,
          type: 'feed',
        },
        {
          collapsed: false,
          collapsible: false,
          data: resultsCommunities.map((result) => result.obj),
          key: 'communities',
          loading: false,
          type: 'community',
        },
        {
          collapsed: false,
          collapsible: false,
          data: resultsUsers.map((result) => result.obj),
          key: 'users',
          loading: false,
          type: 'user',
        },
      ]
    }

    return compact(
      drawerSections.map((section) => {
        if (
          show.includes('type') &&
          section.key === 'feed' &&
          !section.disabled
        ) {
          return {
            collapsed: collapsed.get('type'),
            collapsible: true,
            data: dataType,
            key: 'type',
            loading: false,
            title: t('type.title'),
          }
        }

        if (
          show.includes('feed') &&
          section.key === 'feeds' &&
          !section.disabled &&
          dataFeeds.length > 0
        ) {
          return {
            collapsed: collapsed.get('feeds'),
            collapsible: true,
            data: dataFeeds,
            key: 'feeds',
            loading: loadingFeeds,
            title: t('feeds.title'),
          }
        }

        if (
          show.includes('community') &&
          section.key === 'communities' &&
          !section.disabled &&
          dataCommunities.length > 0
        ) {
          return {
            collapsed: collapsed.get('communities'),
            collapsible: true,
            data: dataCommunities,
            key: 'communities',
            loading: isLoading,
            title: t('communities.title'),
          }
        }

        if (
          show.includes('user') &&
          section.key === 'users' &&
          !section.disabled &&
          dataUsers.length > 0
        ) {
          return {
            collapsed: collapsed.get('users'),
            collapsible: true,
            data: dataUsers,
            key: 'users',
            loading: isLoading,
            title: t('users.title'),
          }
        }

        return null
      }),
    )
  }, [
    collapsed,
    communities,
    drawerSections,
    feeds,
    isLoading,
    loadingFeeds,
    query,
    t,
    users,
    show.includes,
  ])

  return (
    <View style={style}>
      <View>
        <SearchBox onChange={setQuery} value={query} />
      </View>

      <SectionList
        contentContainerStyle={styles.content}
        extraData={{
          collapsed,
          open,
        }}
        getItemLayout={(_data, index) => ({
          index,
          length: space[8],
          offset: space[8] * index,
        })}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={() => <Empty />}
        ref={list}
        refreshControl={
          <RefreshControl
            onRefresh={() => Promise.all([refetch(), refetchFeeds()])}
          />
        }
        renderItem={({ item, section }) => {
          if (section.collapsed) {
            return null
          }

          if (item.type === 'type') {
            return (
              <ListItem
                icon={
                  <Icon
                    name={FeedTypeIcons[item.data]}
                    uniProps={(theme) => ({
                      color: theme.colors[FeedTypeColors[item.data]].accent,
                    })}
                  />
                }
                label={t(`type.${item.data}`)}
                onPress={() => {
                  onPress?.(item)

                  if (drawer) {
                    router.navigate({
                      params: {
                        type: item.data,
                      },
                      pathname: '/',
                    })
                  }
                }}
              />
            )
          }

          if (item.type === 'feed') {
            return (
              <View style={styles.feed(open.get(item.key))}>
                <ListItem
                  label={item.data.name}
                  left={
                    <Image
                      accessibilityIgnoresInvertColors
                      source={item.data.image}
                      style={styles.image}
                    />
                  }
                  onPress={() => {
                    onPress?.(item)

                    if (drawer) {
                      router.navigate({
                        params: {
                          feed: item.data.id,
                        },
                        pathname: '/',
                      })
                    }
                  }}
                  right={
                    drawer ? (
                      <IconButton
                        accessibilityLabel={a11y(
                          open.has(item.key) ? 'collapseFeed' : 'expandFeed',
                        )}
                        onPress={() => {
                          setOpen((previous) => {
                            const next = new Map(previous)

                            next.set(item.key, !next.get(item.key))

                            return next
                          })
                        }}
                        style={styles.right}
                      >
                        <Icon
                          name={
                            open.get(item.key)
                              ? 'caret-circle-down-fill'
                              : 'caret-circle-up-fill'
                          }
                        />
                      </IconButton>
                    ) : null
                  }
                />

                {drawer && open.get(item.key)
                  ? item.data.communities.map((community) => {
                      const exists = communities.find(
                        ({ name }) => name === community,
                      )

                      return (
                        <ListItem
                          key={community}
                          label={community}
                          left={
                            <Image
                              accessibilityIgnoresInvertColors
                              source={exists?.image}
                              style={[styles.image, styles.feedCommunityImage]}
                            />
                          }
                          onPress={() => {
                            onPress?.(item)

                            if (drawer) {
                              router.navigate({
                                params: {
                                  community,
                                },
                                pathname: '/',
                              })
                            }
                          }}
                          size="2"
                          style={styles.feedCommunity}
                        />
                      )
                    })
                  : null}
              </View>
            )
          }

          return (
            <ListItem
              label={item.data.name}
              left={
                <Image
                  accessibilityIgnoresInvertColors
                  source={item.data.image}
                  style={styles.image}
                />
              }
              onPress={() => {
                onPress?.(item)

                if (!drawer) {
                  return
                }

                if (item.type === 'community') {
                  router.navigate({
                    params: {
                      community: item.data.name,
                    },
                    pathname: '/',
                  })

                  return
                }

                router.navigate({
                  params: {
                    name: removePrefix(item.data.name),
                  },
                  pathname: '/users/[name]',
                })
              }}
              right={
                'favorite' in item.data && item.data.favorite ? (
                  <Icon
                    name="star-fill"
                    uniProps={(theme) => ({
                      color: theme.colors.amber.accent,
                    })}
                  />
                ) : null
              }
              style={
                !section.collapsed &&
                section.data.length > 10 &&
                ['communities', 'users'].includes(section.key)
                  ? styles.item
                  : undefined
              }
            />
          )
        }}
        renderScrollComponent={renderScrollComponent}
        renderSectionHeader={({ section }) => {
          if (!section.title) {
            return null
          }

          const sectionIndex = sections.findIndex(
            (item) => item.key === section.key,
          )

          return (
            <>
              {drawer &&
              !section.collapsed &&
              section.data.length > 10 &&
              ['communities', 'users'].includes(section.key) ? (
                <AlphabetList
                  data={section.data as Array<AlphabetItem>}
                  onScroll={(itemIndex) => {
                    list.current?.scrollToLocation({
                      animated: false,
                      itemIndex: itemIndex === 0 ? -1 : itemIndex,
                      sectionIndex,
                      viewOffset: space[8],
                    })
                  }}
                />
              ) : undefined}

              <ListHeader
                left={
                  section.loading ? (
                    <View style={styles.loading}>
                      <Spinner />
                    </View>
                  ) : null
                }
                right={
                  drawer ? (
                    section.collapsible ? (
                      <IconButton
                        accessibilityLabel={a11y(
                          collapsed.get(section.key)
                            ? 'collapseSection'
                            : 'expandSection',
                        )}
                        hitSlop={{
                          left: 300,
                        }}
                        onPress={() => {
                          setCollapsed((previous) => {
                            const next = new Map(previous)

                            next.set(section.key, !next.get(section.key))

                            return next
                          })
                        }}
                      >
                        <Icon
                          name={
                            collapsed.get(section.key)
                              ? 'caret-up'
                              : 'caret-down'
                          }
                        />
                      </IconButton>
                    ) : null
                  ) : null
                }
                style={styles.header}
                title={section.title}
                titleStyle={styles.headerTitle}
              />
            </>
          )
        }}
        sections={sections}
        stickySectionHeadersEnabled={false}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flexGrow: 1,
    paddingBottom: theme.space[4] + runtime.insets.bottom,
  },
  feed: (open?: boolean) => ({
    backgroundColor: open ? theme.colors.accent.bgAltAlpha : undefined,
  }),
  feedCommunity: {
    height: theme.space[7],
    paddingLeft: theme.space[4],
  },
  feedCommunityImage: {
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
  },
  header: {
    alignItems: 'flex-start',
    paddingLeft: theme.space[3],
  },
  headerTitle: {
    color: theme.colors.accent.textLow,
  },
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  item: {
    marginRight: theme.space[5],
  },
  loading: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
    width: theme.space[8],
  },
  right: {
    marginRight: -theme.space[3],
  },
}))
