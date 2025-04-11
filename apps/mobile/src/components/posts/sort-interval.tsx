import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IntervalIcons, SortColors, SortIcons } from '~/lib/sort'
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

import {
  ContextMenu,
  type MenuIconName,
  type MenuOption,
} from '../common/context-menu'
import { Icon } from '../common/icon'
import { View } from '../common/view'

export type SortIntervalMenuData<Type extends SortType> = {
  interval?: TopInterval
  sort: Type extends 'comment'
    ? CommentSort
    : Type extends 'community'
      ? CommunityFeedSort
      : Type extends 'search'
        ? SearchSort
        : Type extends 'user'
          ? UserFeedSort
          : FeedSort
}

type Props<Type extends SortType> = SortIntervalMenuData<Type> & {
  onChange: (data: SortIntervalMenuData<Type>) => void
  type: Type
}

export function SortIntervalMenu<Type extends SortType>({
  interval,
  onChange,
  sort,
  type,
}: Props<Type>) {
  const t = useTranslations('component.common')
  const a11y = useTranslations('a11y')

  const { theme } = useStyles()

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

  const intervalOptions = useMemo(
    () =>
      TopInterval.map<MenuOption>((item) => ({
        action() {
          onChange({
            interval: item,
            sort: 'top' as SortIntervalMenuData<Type>['sort'],
          })
        },
        icon: {
          color: theme.colors.gold.accent,
          name: IntervalIcons[item],
          type: 'symbol',
        },
        id: item,
        state: item === interval ? 'on' : undefined,
        title: t(`interval.${item}`),
      })),
    [interval, onChange, t, theme.colors.gold.accent],
  )

  const sortOptions = useMemo(
    () =>
      items.map<MenuOption>((item) => ({
        action() {
          onChange({
            sort: item as SortIntervalMenuData<Type>['sort'],
          })
        },
        icon: {
          color: theme.colors[SortColors[item]].accent,
          name: sortIcons[item],
          type: 'icon',
        },
        id: item,
        options: item === 'top' ? intervalOptions : undefined,
        state: item === sort ? 'on' : undefined,
        title: t(`sort.${item}`),
      })),
    [intervalOptions, items, onChange, sort, t, theme.colors],
  )

  return (
    <ContextMenu label={a11y('changeSorting')} options={sortOptions} tap>
      <View align="center" direction="row" gap="2" height="8" px="3" self="end">
        <Icon
          color={theme.colors[SortColors[sort]].accent}
          name={SortIcons[sort]}
          size={theme.space[5]}
          weight="duotone"
        />

        {sort === 'top' && interval ? (
          <SymbolView
            name={IntervalIcons[interval]}
            size={20}
            tintColor={theme.colors.gold.accent}
          />
        ) : null}

        <Icon
          color={theme.colors.gray.textLow}
          name="CaretDown"
          size={theme.space[4]}
          weight="bold"
        />
      </View>
    </ContextMenu>
  )
}

const sortIcons: Record<PostSort, MenuIconName> = {
  best: 'medal-duotone',
  comments: 'chat-circle-duotone',
  confidence: 'medal-duotone',
  controversial: 'sword-duotone',
  hot: 'flame-duotone',
  new: 'clock-duotone',
  old: 'package-duotone',
  relevance: 'target-duotone',
  rising: 'chart-line-up-duotone',
  top: 'ranking-duotone',
}
