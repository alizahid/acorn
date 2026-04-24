import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { GlassView } from '~/components/native/glass-view'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useSorting } from '~/hooks/sorting'
import { glass, iPad } from '~/lib/common'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { defaultsStore } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'
import { FeedType } from '~/types/sort'

const schema = z.object({
  feed: z.string().optional(),
  type: z.enum(FeedType).catch(() => {
    const stored = defaultsStore.getState().feedType
    return FeedType.includes(stored as (typeof FeedType)[number])
      ? stored
      : 'home'
  }),
})

export type HomeParams = z.infer<typeof schema>

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.home')
  const a11y = useTranslations('a11y')
  const tType = useTranslations('component.common.type.type')

  const { stickyDrawer } = usePreferences(['stickyDrawer'])

  styles.useVariants({
    iPad,
  })

  const type = params.type === 'home' ? 'feed' : 'community'

  const { sorting, update } = useSorting(type, params.feed ?? params.type)

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerLeft:
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
        headerRight: () => (
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
        headerTitle: params.feed
          ? null
          : () => (
              <GlassView style={styles.title}>
                <Icon
                  name={FeedTypeIcons[params.type]}
                  uniProps={(theme) => ({
                    tintColor: theme.colors[FeedTypeColors[params.type]].accent,
                  })}
                />

                <Text weight="bold">{tType(params.type)}</Text>
              </GlassView>
            ),
        title: params.feed ?? t('title'),
      })
    }, [
      a11y,
      params.feed,
      params.type,
      sorting.interval,
      sorting.sort,
      stickyDrawer,
      tType,
      type,
      update,
      navigation,
      t,
    ]),
  )

  return (
    <PostList
      community={params.type === 'home' ? undefined : params.type}
      feed={params.feed}
      interval={sorting.interval}
      sort={sorting.sort}
      style={styles.list}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
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
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 44,
    flexDirection: 'row',
    gap: theme.space[2],
    height: 44,
    paddingLeft: theme.space[3],
    paddingRight: theme.space[4],
  },
}))
