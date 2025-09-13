import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import fuzzysort from 'fuzzysort'
import { compact } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import { SectionList, type SectionListData } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { View } from '~/components/common/view'
import { type ListProps } from '~/hooks/list'
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
  chevron?: boolean
  listProps?: ListProps<Item>
  onPress?: () => void
  query?: string
}

export function CommunitiesList({
  chevron,
  listProps,
  onPress,
  query = '',
}: Props) {
  const router = useRouter()

  const t = useTranslations('component.common.type')
  const a11y = useTranslations('a11y')

  const { drawerSections } = useDefaults()

  const { feeds, isLoading: loadingFeeds } = useFeeds()
  const { communities, isLoading: loadingCommunities, users } = useCommunities()

  const list = useRef<SectionList<Item, Section>>(null)

  const [collapsed, setCollapsed] = useState(new Map<string, boolean>())
  const [expanded, setExpanded] = useState(new Map<string, boolean>())

  const sections: Array<SectionListData<Item, Section>> = useMemo(() => {
    const dataCommunities: Array<Item> = communities.map((item) => ({
      data: item,
      key: item.id,
      type: 'community',
    }))

    const dataUsers: Array<Item> = users.map((item) => ({
      data: item,
      key: item.id,
      type: 'user',
    }))

    if (query.length > 1) {
      const resultsCommunities = fuzzysort.go(query, dataCommunities, {
        key: 'data.name',
      })

      const resultsUsers = fuzzysort.go(query, dataUsers, {
        key: 'data.name',
      })

      return [
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
        if (section.key === 'feed' && !section.disabled) {
          return {
            collapsed: collapsed.get('type'),
            collapsible: true,
            data: FeedType.map((item) => ({
              data: item,
              key: item,
              type: 'type' as const,
            })),
            key: 'type',
            loading: false,
            title: t('type.title'),
          }
        }

        if (section.key === 'feeds' && !section.disabled && feeds.length > 0) {
          return {
            collapsed: collapsed.get('feeds'),
            collapsible: true,
            data: feeds.map((item) => ({
              data: item,
              key: item.id,
              type: 'feed',
            })),
            key: 'feeds',
            loading: loadingFeeds,
            title: t('feeds.title'),
          }
        }

        if (
          section.key === 'communities' &&
          !section.disabled &&
          communities.length > 0
        ) {
          return {
            collapsed: collapsed.get('communities'),
            collapsible: true,
            data: communities.map((item) => ({
              data: item,
              key: item.id,
              type: 'community',
            })),
            key: 'communities',
            loading: loadingCommunities,
            title: t('communities.title'),
          }
        }

        if (section.key === 'users' && !section.disabled && users.length > 0) {
          return {
            collapsed: collapsed.get('users'),
            collapsible: true,
            data: users.map((item) => ({
              data: item,
              key: item.id,
              type: 'user',
            })),
            key: 'users',
            loading: loadingCommunities,
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
    loadingCommunities,
    loadingFeeds,
    query,
    t,
    users,
  ])

  return (
    <SectionList
      {...listProps}
      extraData={{
        collapsed,
        expanded,
      }}
      getItemLayout={(_data, index) => ({
        index,
        length: space[8],
        offset: space[8] * index,
      })}
      keyExtractor={(item) => item.key}
      ListEmptyComponent={() => <Empty />}
      ref={list}
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
                    tintColor: theme.colors[FeedTypeColors[item.data]].accent,
                  })}
                />
              }
              label={t(`type.${item.data}`)}
              onPress={() => {
                onPress?.()

                router.navigate({
                  params: {
                    type: item.data,
                  },
                  pathname: '/',
                })
              }}
              right={
                chevron ? (
                  <Icon
                    name="chevron.right"
                    uniProps={(theme) => ({
                      size: theme.space[4],
                      tintColor: theme.colors.gray.accent,
                    })}
                  />
                ) : null
              }
            />
          )
        }

        if (item.type === 'feed') {
          return (
            <>
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
                  onPress?.()

                  router.navigate({
                    params: {
                      feed: item.data.id,
                    },
                    pathname: '/',
                  })
                }}
                right={
                  <IconButton
                    icon={
                      expanded.get(item.key)
                        ? 'chevron.down.circle.fill'
                        : 'chevron.up.circle.fill'
                    }
                    label={a11y(
                      expanded.get(item.key) ? 'collapseFeed' : 'expandFeed',
                    )}
                    onPress={() => {
                      setExpanded((previous) => {
                        const next = new Map(previous)

                        next.set(item.key, !next.get(item.key))

                        return next
                      })
                    }}
                    style={styles.right}
                  />
                }
              />

              {expanded.get(item.key)
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
                        navigate
                        onPress={() => {
                          onPress?.()

                          router.push({
                            params: {
                              name: community,
                            },
                            pathname: '/communities/[name]',
                          })
                        }}
                        size="2"
                        style={styles.feedCommunity}
                      />
                    )
                  })
                : null}
            </>
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
              onPress?.()

              if (item.type === 'community') {
                router.push({
                  params: {
                    name: item.data.name,
                  },
                  pathname: '/communities/[name]',
                })

                return
              }

              router.push({
                params: {
                  name: removePrefix(item.data.name),
                },
                pathname: '/users/[name]',
              })
            }}
            right={
              <>
                {'favorite' in item.data && item.data.favorite ? (
                  <Icon
                    name="star.fill"
                    uniProps={(theme) => ({
                      tintColor: theme.colors.amber.accent,
                    })}
                  />
                ) : null}

                {chevron ? (
                  <Icon
                    name="chevron.right"
                    uniProps={(theme) => ({
                      size: theme.space[4],
                      tintColor: theme.colors.gray.accent,
                    })}
                  />
                ) : null}
              </>
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
      renderSectionHeader={({ section }) => {
        if (!section.title) {
          return null
        }

        const sectionIndex = sections.findIndex(
          (item) => item.key === section.key,
        )

        return (
          <>
            {!section.collapsed &&
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
                  <View align="center" height="8" justify="center" width="8">
                    <Spinner />
                  </View>
                ) : null
              }
              right={
                section.collapsible ? (
                  <IconButton
                    hitSlop={{
                      left: 300,
                    }}
                    icon={
                      collapsed.get(section.key) ? 'chevron.up' : 'chevron.down'
                    }
                    label={a11y(
                      collapsed.get(section.key)
                        ? 'collapseSection'
                        : 'expandSection',
                    )}
                    onPress={() => {
                      setCollapsed((previous) => {
                        const next = new Map(previous)

                        next.set(section.key, !next.get(section.key))

                        return next
                      })
                    }}
                  />
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
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  feedCommunity: {
    height: theme.space[7],
    paddingLeft: theme.space[8],
    paddingRight: theme.space[4],
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
  right: {
    marginRight: -theme.space[3],
  },
}))
