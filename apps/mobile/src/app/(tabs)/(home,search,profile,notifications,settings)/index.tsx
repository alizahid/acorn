import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { type SortingType, useSorting } from '~/hooks/sorting'
import { iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { space } from '~/styles/tokens'
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

  const defaults = useDefaults(
    useShallow((state) => ({
      community: state.community,
      feed: state.feed,
      feedType: state.feedType,
    })),
  )

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
        headerRight: () => (
          <IconButton
            label={a11y('toggleSidebar')}
            onPress={() => {
              mitter.emit('drawer-toggle')
            }}
          >
            <Icon name="sidebar" />
          </IconButton>
        ),
        headerTitle:
          name === 'home' || name === 'all' || name === 'popular'
            ? () => (
                <View style={styles.header}>
                  <Icon
                    name={FeedTypeIcons[name]}
                    uniProps={(theme) => ({
                      color: theme.colors[FeedTypeColors[name]].accent,
                    })}
                  />

                  <Text weight="bold">{tType(name)}</Text>
                </View>
              )
            : null,
        title: community ?? feed ?? t('title'),
      })
    }, [
      a11y,
      sorting,
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

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
  })

  return (
    <PostList
      community={community}
      feed={feed}
      interval={sorting.interval}
      listProps={listProps}
      sort={sorting.sort}
      style={styles.list}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  list: {
    variants: {
      iPad: {
        true: {
          paddingHorizontal: theme.space[4],
        },
      },
    },
  },
  sort: {
    paddingHorizontal: theme.space[3],
  },
}))
