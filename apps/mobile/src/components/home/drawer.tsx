import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import fuzzysort from 'fuzzysort'
import { useMemo, useRef, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { View } from '~/components/common/view'
import { useList } from '~/hooks/list'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { removePrefix } from '~/lib/reddit'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { type Community } from '~/types/community'
import { type Feed } from '~/types/feed'
import { FeedType } from '~/types/sort'

import { Empty } from '../common/empty'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { TextBox } from '../common/text-box'
import { HeaderButton } from '../navigation/header-button'
import { SheetHeader } from '../sheets/header'
import { SheetItem } from '../sheets/item'
import { type FeedTypeOptions } from './type-menu'

type Item =
  | {
      key: string
      title: string
      type: 'header'
    }
  | {
      key: string
      type: 'separator'
    }
  | {
      key: string
      type: 'empty'
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
  data: FeedTypeOptions
  onChange: (data: FeedTypeOptions) => void
  onClose: () => void
}

export function HomeDrawer({ data, onChange, onClose }: Props) {
  const router = useRouter()

  const t = useTranslations('component.common.type')
  const tDrawer = useTranslations('component.home.drawer')

  const list = useRef<FlashList<Item>>(null)

  useScrollToTop(list)

  const { styles, theme } = useStyles(stylesheet)

  const { feeds, isLoading: loadingFeeds } = useFeeds()
  const { communities, isLoading: loadingCommunities, users } = useCommunities()

  const listProps = useList({
    header: false,
  })

  const [query, setQuery] = useState('')

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
        type: 'separator',
      },
      {
        key: 'feed',
        title: t('feeds.title'),
        type: 'header',
      },
    ]

    const communityItems: Array<Item> = [
      {
        key: 'community-separator',
        type: 'separator',
      },
      {
        key: 'community',
        title: t('communities.title'),
        type: 'header',
      },
    ]

    const userItems: Array<Item> = [
      {
        key: 'user-separator',
        type: 'separator',
      },
      {
        key: 'user',
        title: t('users.title'),
        type: 'header',
      },
    ]

    return [
      {
        key: 'type-title',
        title: t('type.title'),
        type: 'header' as const,
      },
      ...FeedType.map((item) => ({
        data: item,
        key: item,
        type: 'type' as const,
      })),

      ...(loadingFeeds
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
              ...feeds.map((item) => ({
                data: item,
                key: item.id,
                type: 'feed' as const,
              })),
            ]
          : []),

      ...(loadingCommunities
        ? [
            ...communityItems,
            {
              key: 'community-spinner',
              type: 'spinner' as const,
            },
          ]
        : dataCommunities.length > 0
          ? [...communityItems, ...dataCommunities]
          : []),

      ...(loadingCommunities
        ? [
            ...userItems,
            {
              key: 'user-spinner',
              type: 'spinner' as const,
            },
          ]
        : dataUsers.length > 0
          ? [...userItems, ...dataUsers]
          : []),
    ] satisfies Array<Item>
  }, [communities, feeds, loadingCommunities, loadingFeeds, query, t, users])

  return (
    <View style={styles.main}>
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
          data,
        }}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.key}
        ref={list}
        renderItem={({ item }) => {
          if (item.type === 'separator') {
            return <View height="8" />
          }

          if (item.type === 'empty') {
            return (
              <Icon
                color={theme.colors.accent.a9}
                name="SmileySad"
                size={theme.space[8]}
                style={styles.empty}
                weight="fill"
              />
            )
          }

          if (item.type === 'spinner') {
            return <Spinner m="4" />
          }

          if (item.type === 'header') {
            return <SheetHeader style={styles.header} title={item.title} />
          }

          if (item.type === 'type') {
            return (
              <SheetItem
                icon={{
                  color: theme.colors[FeedTypeColors[item.data]].a9,
                  name: FeedTypeIcons[item.data],
                }}
                label={t(`type.${item.data}`)}
                onPress={() => {
                  onClose()

                  onChange({
                    type: item.data,
                  })
                }}
                selected={
                  !data.feed &&
                  !data.community &&
                  !data.user &&
                  item.data === data.type
                }
              />
            )
          }

          return (
            <SheetItem
              label={item.data.name}
              left={<Image source={item.data.image} style={styles.image} />}
              onPress={() => {
                onClose()

                onChange({
                  [item.type]:
                    item.type === 'community'
                      ? item.data.name
                      : item.type === 'user'
                        ? removePrefix(item.data.name)
                        : item.data.id,
                })
              }}
              right={
                <>
                  {'favorite' in item.data && item.data.favorite ? (
                    <Icon
                      color={theme.colors.amber.a9}
                      name="Star"
                      size={theme.space[4]}
                      weight="fill"
                    />
                  ) : null}

                  {item.type === 'community' || item.type === 'user' ? (
                    <Pressable
                      align="center"
                      height="8"
                      justify="center"
                      m="-3"
                      onPress={() => {
                        if (item.data.user) {
                          router.push({
                            params: {
                              name: removePrefix(item.data.name),
                            },
                            pathname: '/users/[name]',
                          })
                        } else {
                          router.push({
                            params: {
                              name: removePrefix(item.data.name),
                            },
                            pathname: '/communities/[name]',
                          })
                        }
                      }}
                      width="8"
                    >
                      <Icon
                        color={theme.colors.gray.a9}
                        name="ArrowRight"
                        size={theme.space[4]}
                      />
                    </Pressable>
                  ) : null}
                </>
              }
              selected={
                item.type === 'community'
                  ? item.data.name === data.community
                  : item.type === 'user'
                    ? item.data.name === data.user
                    : item.data.id === data.feed
              }
            />
          )
        }}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    paddingBottom:
      runtime.insets.bottom + theme.space[4] + theme.space[5] + theme.space[4],
  },
  empty: {
    marginHorizontal: 'auto',
    marginVertical: theme.space[4],
  },
  header: {
    backgroundColor: theme.colors.gray[2],
  },
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  main: {
    flex: 1,
    marginTop: runtime.insets.top + theme.space[8],
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
