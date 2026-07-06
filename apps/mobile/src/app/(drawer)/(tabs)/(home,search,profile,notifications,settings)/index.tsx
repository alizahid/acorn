import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useCallback, useMemo } from 'react'
import { PlatformColor } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { GlassView } from '~/components/native/glass-view'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { type SortingType, useSorting } from '~/hooks/sorting'
import { glass, iPad } from '~/lib/common'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'
import { FeedType } from '~/types/sort'

const schema = z.object({
  community: z.string().optional(),
  feed: z.string().optional(),
  type: z.enum(FeedType).optional(),
})

export type HomeParams = z.infer<typeof schema>

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.home')
  const a11y = useTranslations('a11y')
  const tType = useTranslations('component.common.type.type')

  const { stickyDrawer } = usePreferences(['stickyDrawer'])
  const defaults = useDefaults(['community', 'feed', 'feedType'])

  styles.useVariants({
    iPad,
  })

  const { community, feed, type } = useMemo(() => {
    const data = {
      community: params.community ?? defaults.community,
      feed: params.feed ?? defaults.feed,
      type: params.type ?? defaults.feedType,
    } as const

    const $type: SortingType = data.community
      ? 'community'
      : data.feed
        ? 'feed'
        : data.type === 'home'
          ? 'feed'
          : 'community'

    const $feed = data.community ? undefined : data.feed ? data.feed : undefined

    const $community = data.community
      ? data.community
      : data.type === 'home'
        ? undefined
        : data.type

    return {
      community: $community,
      feed: $feed,
      type: $type,
    }
  }, [
    defaults.community,
    defaults.feed,
    defaults.feedType,
    params.community,
    params.feed,
    params.type,
  ])

  const name = community ?? feed ?? 'home'

  const { sorting, update } = useSorting(type, name)

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerLeft: () => (
          <SortIntervalMenu
            interval={sorting.interval}
            onChange={(next) => {
              update(next)
            }}
            sort={sorting.sort}
            style={styles.sort}
            type={type}
          />
        ),
        headerRight:
          iPad && stickyDrawer
            ? null
            : () => (
                <IconButton
                  icon="sidebar.leading"
                  label={a11y('toggleSidebar')}
                  onPress={() => {
                    // @ts-expect-error
                    navigation.toggleDrawer()
                  }}
                  size="6"
                  weight="medium"
                />
              ),
        headerTitle: () =>
          name === 'home' || name === 'all' || name === 'popular' ? (
            <GlassView style={styles.header}>
              <Icon
                name={FeedTypeIcons[name]}
                uniProps={(theme) => ({
                  tintColor: theme.colors[FeedTypeColors[name!]].accent,
                })}
              />

              <Text style={styles.title} weight="bold">
                {tType(name)}
              </Text>
            </GlassView>
          ) : null,
        title: community ?? feed ?? t('title'),
      })
    }, [
      a11y,
      sorting,
      stickyDrawer,
      tType,
      type,
      update,
      navigation,
      t,
      community,
      feed,
      name,
    ]),
  )

  return (
    <PostList
      community={community}
      feed={feed}
      interval={sorting.interval}
      sort={sorting.sort}
      style={styles.list}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 44,
    flexDirection: 'row',
    gap: theme.space[2],
    height: 44,
    paddingLeft: theme.space[3],
    paddingRight: theme.space[4],
  },
  list: {
    variants: {
      iPad: {
        true: {
          padding: theme.space[4],
        },
      },
    },
  },
  sort: {
    paddingHorizontal: glass ? theme.space[2] : 0,
  },
  title: {
    color: PlatformColor('labelColor'),
  },
}))
