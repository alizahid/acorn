import { Stack, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { PlatformColor } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { GlassView } from '~/components/native/glass-view'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { type SortingType, useSorting } from '~/hooks/sorting'
import { glass, iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { FeedType } from '~/types/sort'

const schema = z.object({
  community: z.string().optional(),
  feed: z.string().optional(),
  type: z.enum(FeedType).optional(),
})

export type HomeParams = z.infer<typeof schema>

export default function Screen() {
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

  const listProps = useListProps(true)

  return (
    <>
      {name === 'home' || name === 'all' || name === 'popular' ? (
        <Stack.Title asChild>
          <GlassView style={styles.header}>
            <Icon
              name={FeedTypeIcons[name]}
              uniProps={(theme) => ({
                color: theme.colors[FeedTypeColors[name]].accent,
              })}
            />

            <Text style={styles.title} weight="bold">
              {tType(name)}
            </Text>
          </GlassView>
        </Stack.Title>
      ) : (
        <Stack.Title>{community ?? feed ?? t('title')}</Stack.Title>
      )}

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View>
          <SortIntervalMenu
            interval={sorting.interval}
            onChange={(next) => {
              update(next)
            }}
            sort={sorting.sort}
            style={styles.sort}
            type={type}
          />
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <IconButton
            header
            label={a11y('toggleSidebar')}
            onPress={() => {
              mitter.emit('drawer-toggle')
            }}
          >
            <Icon name="sidebar" />
          </IconButton>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <PostList
        community={community}
        feed={feed}
        interval={sorting.interval}
        listProps={listProps}
        sort={sorting.sort}
        style={styles.list}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    flexDirection: 'row',
    gap: theme.space[2],
    height: theme.space[8],
    paddingHorizontal: theme.space[4],
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
    gap: theme.space[1],
    paddingHorizontal: glass ? theme.space[1] : 0,
  },
  title: {
    color: PlatformColor('labelColor'),
  },
}))
