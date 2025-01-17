import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { SymbolView } from 'expo-symbols'
import { useRef } from 'react'
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
import { SheetItem } from '../sheets/item'
import { SheetModal } from '../sheets/modal'

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

  const sheetSort = useRef<BottomSheetModal>(null)
  const sheetInterval = useRef<BottomSheetModal>(null)

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
      <Pressable
        align="center"
        direction="row"
        gap="2"
        height="8"
        onPress={() => {
          sheetSort.current?.present()
        }}
        px="3"
        self="end"
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

      <SheetModal container="view" ref={sheetSort} title={t('sort.title')}>
        {items.map((item) => (
          <SheetItem
            icon={{
              color: theme.colors[SortColors[item]].a9,
              name: SortIcons[item],
              type: 'icon',
            }}
            key={item}
            label={t(`sort.${item}`)}
            navigate={item === 'top'}
            onPress={() => {
              if (item === 'top') {
                sheetInterval.current?.present()

                return
              }

              onChange({
                sort: item as SortIntervalMenuData<Type>['sort'],
              })

              sheetSort.current?.dismiss()
            }}
            selected={item === sort}
          />
        ))}
      </SheetModal>

      <SheetModal
        container="view"
        ref={sheetInterval}
        title={t('interval.title')}
      >
        {TopInterval.map((item) => (
          <SheetItem
            key={item}
            label={t(`interval.${item}`)}
            left={
              <SymbolView
                name={IntervalIcons[item]}
                tintColor={theme.colors.gold.a9}
              />
            }
            onPress={() => {
              onChange({
                interval: item,
                sort: 'top' as SortIntervalMenuData<Type>['sort'],
              })

              sheetInterval.current?.dismiss()
              sheetSort.current?.dismiss()
            }}
            selected={sort === 'top' && item === interval}
          />
        ))}
      </SheetModal>
    </>
  )
}
