import ActionSheet, {
  type RouteDefinition,
  type RouteScreenProps,
  type SheetDefinition,
  SheetManager,
  type SheetProps,
  useSheetPayload,
} from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { TopIntervalItem } from '~/components/posts/interval'
import { SortColors, SortIcons } from '~/lib/sort'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  type PostSort,
  SearchSort,
  type SortType,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

import { SheetHeader } from './header'
import { SheetItem } from './item'

export type PostSortSheetPayload = {
  interval?: TopInterval
  sort?: PostSort
  type: SortType
}

export type PostSortSheetRoutes = {
  interval: RouteDefinition<{
    interval?: TopInterval
    sort: PostSort
  }>
  sort: RouteDefinition
}

export type PostSortSheetReturnValue = {
  interval?: TopInterval
  sort: PostSort
}

export type PostSortSheetDefinition = SheetDefinition<{
  payload: PostSortSheetPayload
  returnValue: PostSortSheetReturnValue
  routes: PostSortSheetRoutes
}>

export function PostSortSheet({ sheetId }: SheetProps<'post-sort'>) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <ActionSheet
      containerStyle={styles.main}
      enableRouterBackNavigation
      gestureEnabled
      id={sheetId}
      indicatorStyle={styles.indicator}
      initialRoute="sort"
      overlayColor={theme.colors.gray.a9}
      routes={[
        {
          component: Sort,
          name: 'sort',
        },
        {
          component: Interval,
          name: 'interval',
        },
      ]}
    />
  )
}

function Sort({ router }: RouteScreenProps<'post-sort', 'sort'>) {
  const t = useTranslations('component.common.sort')

  const { interval, sort, type } = useSheetPayload<'post-sort'>()

  const { theme } = useStyles(stylesheet)

  const items =
    type === 'comment'
      ? CommentSort
      : type === 'community'
        ? CommunityFeedSort
        : type === 'search'
          ? SearchSort
          : type === 'user'
            ? UserFeedSort
            : FeedSort

  return (
    <>
      <SheetHeader title={t('title')} />

      {items.map((item) => (
        <SheetItem
          icon={{
            color: theme.colors[SortColors[item]].a9,

            name: SortIcons[item],
          }}
          key={item}
          label={t(item)}
          navigate={item === 'top'}
          onPress={() => {
            if (item === 'top') {
              router.navigate('interval', {
                interval,
                sort: item,
              })

              return
            }

            void SheetManager.hide('post-sort', {
              payload: {
                sort: item,
              },
            })
          }}
          selected={item === sort}
        />
      ))}
    </>
  )
}

function Interval({ params }: RouteScreenProps<'post-sort', 'interval'>) {
  const t = useTranslations('component.common.interval')

  return (
    <>
      <SheetHeader title={t('title')} />

      {TopInterval.map((item) => (
        <SheetItem
          key={item}
          label={t(item)}
          left={<TopIntervalItem interval={item} />}
          onPress={() => {
            void SheetManager.hide('post-sort', {
              payload: {
                interval: item,
                sort: params.sort,
              },
            })
          }}
          selected={item === params.interval}
        />
      ))}
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  indicator: {
    display: 'none',
  },
  main: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[3] + runtime.insets.bottom,
  },
}))
