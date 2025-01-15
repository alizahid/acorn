import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import fuzzysort from 'fuzzysort'
import { useMemo, useState } from 'react'
import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { View } from '~/components/common/view'
import { useList } from '~/hooks/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { type Community } from '~/types/community'
import { type Feed } from '~/types/feed'
import { FeedType } from '~/types/sort'

import { Empty } from '../common/empty'
import { Spinner } from '../common/spinner'
import { TextBox } from '../common/text-box'
import { HeaderButton } from '../navigation/header-button'
import { SheetHeader } from '../sheets/header'
import { SheetItem } from '../sheets/item'

type Item =
  | {
      key: string
      title: string
      type: 'header'
    }
  | {
      key: string
      type: 'spinner'
    }
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
      data: string
      key: string
      type: 'feed-community'
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
  | {
      key: string
      type: 'separator'
    }

const schema = z.object({
  feed: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(FeedType).catch('home'),
})

type Props = {
  onClose?: () => void
}

export function HomeDrawer({ onClose }: Props) {
  const router = useRouter()
  const params = schema.parse(useGlobalSearchParams())

  const t = useTranslations('component.common.type')
  const tDrawer = useTranslations('component.home.drawer')

  const { drawerSections } = useDefaults()

  const { styles, theme } = useStyles(stylesheet)

  const { feeds, isLoading: loadingFeeds } = useFeeds()
  const { communities, isLoading: loadingCommunities, users } = useCommunities()

  const listProps = useList({
    header: false,
  })

  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(new Map<string, boolean>())
  const [expanded, setExpanded] = useState(new Map<string, boolean>())

  const items: Array<Item> = useMemo(() => {
    const dataCommunities: Array<Item> = communities
      .filter((item) => typeof item !== 'string')
      .map((item) => ({
        data: item,
        key: item.id,
        type: 'community',
      }))

    const dataUsers: Array<Item> = users
      .filter((item) => typeof item !== 'string')
      .map((item) => ({
        data: item,
        key: item.id,
        type: 'user',
      }))

    if (query.length > 1) {
      const results = fuzzysort.go(query, [...dataCommunities, ...dataUsers], {
        key: 'data.name',
      })

      return results.map((result) => result.obj)
    }

    const feedItems: Array<Item> = [
      {
        key: 'feed-separator',
        type: 'separator' as const,
      },
      {
        key: 'feeds',
        title: t('feeds.title'),
        type: 'header',
      },
    ]

    const communityItems: Array<Item> = [
      {
        key: 'communities-separator',
        type: 'separator' as const,
      },
      {
        key: 'communities',
        title: t('communities.title'),
        type: 'header',
      },
    ]

    const userItems: Array<Item> = [
      {
        key: 'user',
        title: t('users.title'),
        type: 'header',
      },
    ]

    return drawerSections.flatMap<Item>((section) => {
      if (section.key === 'feed' && !section.disabled) {
        return [
          {
            key: 'feed',
            title: t('type.title'),
            type: 'header' as const,
          },
          ...(collapsed.get('feed')
            ? []
            : FeedType.map((item) => ({
                data: item,
                key: item,
                type: 'type' as const,
              }))),
        ]
      }

      if (section.key === 'feeds' && !section.disabled) {
        return loadingFeeds
          ? [
              ...feedItems,
              {
                key: 'feed-spinner',
                type: 'spinner' as const,
              },
            ]
          : feeds.length > 0
            ? [
                ...feedItems,
                ...(collapsed.get('feeds')
                  ? []
                  : feeds.flatMap((item) => [
                      {
                        data: item,
                        key: item.id,
                        type: 'feed' as const,
                      },
                      ...(expanded.get(item.id)
                        ? item.communities.map((community) => ({
                            data: community,
                            key: community,
                            type: 'feed-community' as const,
                          }))
                        : []),
                    ])),
              ]
            : []
      }

      if (section.key === 'communities' && !section.disabled) {
        return loadingCommunities
          ? [
              ...communityItems,
              {
                key: 'community-spinner',
                type: 'spinner' as const,
              },
            ]
          : dataCommunities.length > 0
            ? [
                ...communityItems,
                ...(collapsed.get('communities') ? [] : dataCommunities),
              ]
            : []
      }

      if (section.key === 'users' && !section.disabled) {
        return loadingCommunities
          ? [
              ...userItems,
              {
                key: 'user-spinner',
                type: 'spinner' as const,
              },
            ]
          : dataUsers.length > 0
            ? [...userItems, ...(collapsed.get('users') ? [] : dataUsers)]
            : []
      }

      return []
    })
  }, [
    collapsed,
    communities,
    drawerSections,
    expanded,
    feeds,
    loadingCommunities,
    loadingFeeds,
    query,
    t,
    users,
  ])

  const sticky = items
    .map((item, index) => (item.type === 'header' ? index : null))
    .filter((item) => item !== null)

  return (
    <View style={styles.main() as ViewStyle}>
      <TextBox
        left={
          <Icon
            color={theme.colors.gray.a9}
            name="MagnifyingGlass"
            style={styles.searchIcon}
          />
        }
        onChangeText={setQuery}
        placeholder={tDrawer('search.placeholder')}
        returnKeyType="search"
        right={
          query.length > 0 ? (
            <HeaderButton
              color="gray"
              icon="XCircle"
              onPress={() => {
                setQuery('')
              }}
              weight="fill"
            />
          ) : null
        }
        style={styles.search}
        styleContent={styles.searchContent}
        value={query}
      />

      <FlashList
        {...listProps}
        ListEmptyComponent={<Empty />}
        data={items}
        estimatedItemSize={48}
        extraData={{
          collapsed,
          expanded,
        }}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.type === 'spinner') {
            return (
              <View align="center" height="8" justify="center">
                <Spinner />
              </View>
            )
          }

          if (item.type === 'separator') {
            return <View height="6" />
          }

          if (item.type === 'header') {
            return (
              <SheetHeader
                right={
                  <HeaderButton
                    icon={collapsed.get(item.key) ? 'CaretUp' : 'CaretDown'}
                    onPress={() => {
                      setCollapsed((previous) => {
                        const next = new Map(previous)

                        next.set(item.key, !next.get(item.key))

                        return next
                      })
                    }}
                  />
                }
                title={item.title}
              />
            )
          }

          if (item.type === 'type') {
            return (
              <SheetItem
                icon={{
                  color: theme.colors[FeedTypeColors[item.data]].a9,
                  name: FeedTypeIcons[item.data],
                  type: 'icon',
                }}
                label={t(`type.${item.data}`)}
                onPress={() => {
                  onClose?.()

                  router.navigate({
                    params: {
                      type: item.data,
                    },
                    pathname: '/',
                  })
                }}
                selected={
                  !params.feed && !params.name && item.data === params.type
                }
              />
            )
          }

          if (item.type === 'feed-community') {
            const community = communities
              .filter((subItem) => typeof subItem !== 'string')
              .find((subItem) => subItem.name === item.data)

            return (
              <SheetItem
                label={item.data}
                left={
                  <Image
                    source={community?.image}
                    style={[styles.image, styles.feedCommunityImage]}
                  />
                }
                onPress={() => {
                  onClose?.()

                  router.navigate({
                    params: {
                      name: item.data,
                    },
                    pathname: '/communities/[name]',
                  })
                }}
                selected={item.data === params.name}
                size="2"
                style={styles.feedCommunity}
              />
            )
          }

          return (
            <SheetItem
              label={item.data.name}
              left={<Image source={item.data.image} style={styles.image} />}
              onPress={() => {
                onClose?.()

                if (item.type === 'community') {
                  router.navigate({
                    params: {
                      name: item.data.name,
                    },
                    pathname: '/communities/[name]',
                  })

                  return
                }

                if (item.type === 'user') {
                  router.navigate({
                    params: {
                      name: removePrefix(item.data.name),
                    },
                    pathname: '/users/[name]',
                  })

                  return
                }

                router.navigate({
                  params: {
                    feed: item.data.id,
                  },
                  pathname: '/',
                })
              }}
              right={
                <>
                  {item.type === 'feed' ? (
                    <HeaderButton
                      icon={expanded.get(item.key) ? 'CaretDown' : 'CaretUp'}
                      onPress={() => {
                        setExpanded((previous) => {
                          const next = new Map(previous)

                          next.set(item.key, !next.get(item.key))

                          return next
                        })
                      }}
                      style={styles.right}
                      weight="fill"
                    />
                  ) : null}

                  {'favorite' in item.data && item.data.favorite ? (
                    <Icon
                      color={theme.colors.amber.a9}
                      name="Star"
                      weight="fill"
                    />
                  ) : null}
                </>
              }
              selected={
                item.type === 'community'
                  ? item.data.name === params.name
                  : item.type === 'user'
                    ? removePrefix(item.data.name) === params.name
                    : item.data.id === params.feed
              }
            />
          )
        }}
        stickyHeaderIndices={sticky}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  feedCommunity: {
    height: theme.space[7],
    paddingLeft: theme.space[8],
  },
  feedCommunityImage: {
    height: theme.typography[2].lineHeight,
    width: theme.typography[2].lineHeight,
  },
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  main: () => {
    const base: UnistylesValues = {
      backgroundColor: theme.colors.accent[1],
      flex: 1,
      paddingTop: theme.space[8] + runtime.insets.top + runtime.hairlineWidth,
    }

    if (iPad) {
      return {
        ...base,
        borderRightColor: theme.colors.gray.a6,
        borderRightWidth: runtime.hairlineWidth,
      }
    }

    return base
  },
  right: {
    marginRight: -theme.space[3],
  },
  search: {
    height: theme.space[8],
  },
  searchContent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  searchIcon: {
    marginLeft: theme.space[3],
  },
}))
