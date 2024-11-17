import { MenuView } from '@react-native-menu/menu'
import { SymbolView } from 'expo-symbols'
import { kebabCase } from 'lodash'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IntervalIcons, SortColors, SortIcons } from '~/lib/sort'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  SearchSort,
  type SortType,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

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

  return (
    <MenuView
      actions={items.map((item) => ({
        id: item,
        image: `${kebabCase(SortIcons[item])}-duotone`,
        imageColor: theme.colors[SortColors[item]].a9,
        subactions:
          item === 'top'
            ? TopInterval.map((itemInterval) => ({
                id: itemInterval,
                image: IntervalIcons[itemInterval],
                imageColor: theme.colors.gold.a9,
                title: t(`interval.${itemInterval}`),
              }))
            : undefined,
        title: t(`sort.${item}`),
      }))}
      onPressAction={({ nativeEvent }) => {
        type Sort = Type extends 'comment'
          ? CommentSort
          : Type extends 'community'
            ? CommunityFeedSort
            : Type extends 'search'
              ? SearchSort
              : Type extends 'user'
                ? UserFeedSort
                : FeedSort

        if (TopInterval.includes(nativeEvent.event as TopInterval)) {
          onChange({
            interval: nativeEvent.event as TopInterval,
            sort: 'top' as Sort,
          })

          return
        }

        onChange({
          sort: nativeEvent.event as Sort,
        })
      }}
      title={t('sort.title')}
    >
      <Pressable
        align="center"
        direction="row"
        gap="2"
        height="8"
        justify="end"
        px="3"
      >
        <Icon
          color={theme.colors[SortColors[sort]].a9}
          name={SortIcons[sort]}
          size={theme.space[5]}
          weight="duotone"
        />

        {sort === 'top' && interval ? (
          <SymbolView
            name={IntervalIcons[interval]}
            size={20}
            tintColor={theme.colors.gold.a9}
          />
        ) : null}

        <Icon
          color={theme.colors.gray.a11}
          name="CaretDown"
          size={theme.space[4]}
          weight="bold"
        />
      </Pressable>
    </MenuView>
  )
}
