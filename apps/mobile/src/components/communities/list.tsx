import { FlashList, type FlashListRef } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import fuzzysort from 'fuzzysort'
import { compact, orderBy, sortBy } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { useListProps } from '~/hooks/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/communities/feeds'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { space } from '~/styles/tokens'
import { type Community } from '~/types/community'
import { type Feed } from '~/types/feed'
import { FeedType } from '~/types/sort'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { List } from '../common/list'
import { RefreshControl } from '../common/refresh-control'
import { SearchBox } from '../common/search'
import { Spinner } from '../common/spinner'
import { AlphabetList } from './alphabet'

type Item =
  | {
      collapsed?: boolean
      key: string
      title: string
      type: 'title'
    }
  | {
      key: string
      name: FeedType
      type: 'type'
    }
  | {
      feed: Feed
      key: string
      open?: boolean
      type: 'feed'
    }
  | {
      community?: Community
      key: string
      name: string
      type: 'feed-community'
    }
  | {
      community: Community
      key: string
      type: 'community'
    }
  | {
      key: string
      type: 'loading'
    }
  | {
      key: string
      type: 'separator'
    }

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>
  drawer?: boolean
  onPress?: (item: Item) => void
  show?: Array<'community' | 'feed' | 'type' | 'user'>
  style?: StyleProp<ViewStyle>
}

export function CommunitiesList({
  contentContainerStyle,
  drawer,
  onPress,
  show = ['community', 'feed', 'type', 'user'],
  style,
}: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')
  const t = useTranslations('component.common.type')

  const { drawerSections } = useDefaults(
    useShallow((state) => ({
      drawerSections: state.drawerSections,
    })),
  )

  const { communities, isLoading, users, refetch } = useCommunities()
  const { feeds, isLoading: loadingFeeds, refetch: refetchFeeds } = useFeeds()

  const list = useRef<FlashListRef<Item>>(null)

  const [query, setQuery] = useState('')

  const [collapsed, setCollapsed] = useState(new Map<string, boolean>())
  const [open, setOpen] = useState(new Map<string, boolean>())

  const data: Array<Item> = useMemo(() => {
    const dataType = show.includes('type')
      ? FeedType.map<Item>((item) => ({
          key: item,
          name: item,
          type: 'type',
        }))
      : []

    const dataCommunities = orderBy(
      sortBy(
        [
          ...(show.includes('community')
            ? communities.map(
                (item) =>
                  ({
                    community: item,
                    key: item.id,
                    type: 'community',
                  }) satisfies Item,
              )
            : []),
          ...(show.includes('user')
            ? users.map(
                (item) =>
                  ({
                    community: item,
                    key: item.id,
                    type: 'community',
                  }) satisfies Item,
              )
            : []),
        ],
        (item) =>
          item.community.user
            ? item.community.name.slice(2)
            : item.community.name,
      ),
      (item) => item.community.favorite,
      'desc',
    )

    const dataFeeds = show.includes('feed')
      ? feeds.map(
          (item) =>
            ({
              feed: item,
              key: item.id,
              open: open.get(item.id),
              type: 'feed',
            }) satisfies Item,
        )
      : []

    if (query.length > 0) {
      const resultsFeeds = fuzzysort.go(query, dataFeeds, {
        key: 'community.name',
      })

      const resultsCommunities = fuzzysort.go(query, dataCommunities, {
        key: 'community.name',
      })

      return [
        ...resultsFeeds.map((item) => item.obj),
        ...resultsCommunities.map((item) => item.obj),
      ]
    }

    const sections = compact(
      drawerSections.map((section) => {
        if (
          show.includes('type') &&
          section.key === 'feed' &&
          !section.disabled
        ) {
          return [
            {
              collapsed: collapsed.get('type'),
              key: 'type',
              title: t('type.title'),
              type: 'title',
            } satisfies Item,
            ...(collapsed.get('type') ? [] : dataType),
          ]
        }

        if (
          show.includes('feed') &&
          section.key === 'feeds' &&
          !section.disabled &&
          dataFeeds.length > 0
        ) {
          return compact([
            {
              collapsed: collapsed.get('feeds'),
              key: 'feeds',
              title: t('feeds.title'),
              type: 'title',
            } satisfies Item,
            ...(collapsed.get('feeds')
              ? []
              : dataFeeds.flatMap((item) => {
                  if (open.get(item.feed.id)) {
                    return [
                      item,
                      ...item.feed.communities.map(
                        (name) =>
                          ({
                            community: communities.find(
                              (community) => community.name === name,
                            ),
                            key: `${item.feed.id}-${name}`,
                            name,
                            type: 'feed-community',
                          }) satisfies Item,
                      ),
                    ]
                  }

                  return [item]
                })),
            loadingFeeds
              ? ({
                  key: 'feeds-loading',
                  type: 'loading',
                } satisfies Item)
              : null,
          ])
        }

        if (
          show.includes('community') &&
          section.key === 'communities' &&
          !section.disabled &&
          dataCommunities.length > 0
        ) {
          return compact([
            {
              collapsed: collapsed.get('communities'),
              key: 'communities',
              title: t('communities.title'),
              type: 'title',
            } satisfies Item,
            ...(collapsed.get('communities') ? [] : dataCommunities),
            isLoading
              ? ({
                  key: 'communities-loading',
                  type: 'loading',
                } satisfies Item)
              : null,
          ])
        }

        return null
      }),
    )

    return sections.flatMap((items, index) =>
      compact([
        index > 0
          ? ({
              key: `separator-${index}`,
              type: 'separator',
            } satisfies Item)
          : null,
        ...items,
      ]),
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
    show,
    open,
  ])

  const listProps = useListProps(true)

  const alphabet = communities.length > 20

  return (
    <View style={style}>
      <View>
        <SearchBox onChange={setQuery} value={query} />
      </View>

      <FlashList
        {...listProps}
        contentContainerStyle={[
          styles.content(alphabet),
          contentContainerStyle,
        ]}
        data={data}
        extraData={{
          collapsed,
          open,
          query,
        }}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.key}
        ref={list}
        refreshControl={
          <RefreshControl
            onRefresh={() => Promise.all([refetch(), refetchFeeds()])}
          />
        }
        renderItem={({ item }) => {
          if (item.type === 'type') {
            return (
              <List.Item
                label={t(`type.${item.name}`)}
                left={
                  <Icon
                    name={FeedTypeIcons[item.name]}
                    uniProps={(theme) => ({
                      color: theme.colors[FeedTypeColors[item.name]].accent,
                      size: 20,
                    })}
                  />
                }
                onPress={() => {
                  onPress?.(item)

                  if (drawer) {
                    router.navigate({
                      params: {
                        type: item.name,
                      },
                      pathname: '/',
                    })
                  }
                }}
              />
            )
          }

          if (item.type === 'community') {
            return (
              <List.Item
                label={item.community.name}
                left={
                  <>
                    <Image
                      recyclingKey={item.key}
                      source={item.community.image}
                      style={styles.icon}
                    />

                    {item.community.favorite ? (
                      <View style={styles.favorite}>
                        <Icon
                          name="star-fill"
                          uniProps={(theme) => ({
                            color: theme.colors.amber.contrast,
                            size: theme.space[2],
                          })}
                        />
                      </View>
                    ) : null}
                  </>
                }
                navigate
                onPress={() => {
                  onPress?.(item)

                  if (!drawer) {
                    return
                  }

                  if (item.community.user) {
                    router.navigate({
                      params: {
                        name: removePrefix(item.community.name),
                      },
                      pathname: '/users/[name]',
                    })

                    return
                  }

                  router.navigate({
                    params: {
                      name: item.community.name,
                    },
                    pathname: '/communities/[name]',
                  })
                }}
              />
            )
          }

          if (item.type === 'feed') {
            return (
              <List.Item
                label={item.feed.name}
                left={
                  <Image
                    recyclingKey={item.key}
                    source={item.feed.image}
                    style={styles.icon}
                  />
                }
                onPress={() => {
                  onPress?.(item)

                  if (drawer) {
                    router.navigate({
                      params: {
                        feed: item.feed.name,
                      },
                      pathname: '/',
                    })
                  }
                }}
                right={
                  <IconButton
                    accessibilityLabel={a11y(
                      item.open ? 'collapseSection' : 'expandSection',
                    )}
                    onPress={() => {
                      setOpen((previous) => {
                        const next = new Map(previous)

                        next.set(item.key, !next.get(item.key))

                        return next
                      })
                    }}
                    size="7"
                  >
                    <Icon
                      name={
                        item.open
                          ? 'caret-circle-down-fill'
                          : 'caret-circle-up-fill'
                      }
                      size={space[4]}
                    />
                  </IconButton>
                }
              />
            )
          }

          if (item.type === 'feed-community') {
            return (
              <List.Item
                label={item.community?.name ?? item.name}
                left={
                  <Image
                    recyclingKey={item.key}
                    source={item.community?.image}
                    style={styles.icon}
                  />
                }
                navigate
                onPress={() => {
                  onPress?.(item)

                  if (drawer) {
                    router.navigate({
                      params: {
                        name: item.name,
                      },
                      pathname: '/communities/[name]',
                    })
                  }
                }}
              />
            )
          }

          if (item.type === 'loading') {
            return <Spinner style={styles.spinner} />
          }

          if (item.type === 'separator') {
            return <View style={styles.separator} />
          }

          return (
            <List.Header
              right={
                <IconButton
                  accessibilityLabel={a11y(
                    item.collapsed ? 'expandSection' : 'collapseSection',
                  )}
                  onPress={() => {
                    setCollapsed((previous) => {
                      const next = new Map(previous)

                      next.set(item.key, !next.get(item.key))

                      return next
                    })
                  }}
                  size="7"
                >
                  <Icon name={item.collapsed ? 'caret-up' : 'caret-down'} />
                </IconButton>
              }
              title={item.title}
            />
          )
        }}
        showsVerticalScrollIndicator={false}
      />

      {alphabet ? (
        <AlphabetList
          data={compact(
            data.map((item, index) =>
              item.type === 'community'
                ? {
                    community: item.community,
                    index,
                    key: item.key,
                  }
                : null,
            ),
          )}
          onScroll={(index) => {
            list.current?.scrollToIndex({
              animated: false,
              index,
            })
          }}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: (alphabet: boolean) => ({
    paddingRight: alphabet ? theme.space[5] : undefined,
  }),
  favorite: {
    alignItems: 'center',
    backgroundColor: theme.colors.amber.accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[3],
    bottom: theme.space[2],
    height: theme.space[3],
    justifyContent: 'center',
    position: 'absolute',
    right: theme.space[2],
    width: theme.space[3],
  },
  icon: {
    borderRadius: 20,
    height: 20,
    width: 20,
  },
  item: {
    height: theme.space[7],
  },
  separator: {
    height: theme.space[4],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
