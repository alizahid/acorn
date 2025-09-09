import { useRef } from 'react'
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
import { SymbolIcon } from '../common/icon/symbol'
import { Pressable } from '../common/pressable'
import { Sheet } from '../common/sheet'

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

  const sheetSort = useRef<Sheet>(null)
  const sheetInterval = useRef<Sheet>(null)

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
        label={a11y('changeSorting')}
        onPress={() => {
          sheetSort.current?.present()
        }}
        px="3"
        self="end"
      >
        <Icon
          name={SortIcons[sort]}
          uniProps={($theme) => ({
            color: $theme.colors[SortColors[sort]].accent,
            size: $theme.space[5],
          })}
          weight="duotone"
        />

        {sort === 'top' && interval ? (
          <SymbolIcon
            name={IntervalIcons[interval]}
            size={20}
            uniProps={($theme) => ({
              tintColor: $theme.colors.gold.accent,
            })}
          />
        ) : null}

        <Icon
          name="CaretDown"
          uniProps={($theme) => ({
            color: $theme.colors.gray.textLow,
            size: $theme.space[4],
          })}
          weight="bold"
        />
      </Pressable>

      <Sheet.Root ref={sheetSort}>
        <Sheet.Header title={t('sort.title')} />
        {items.map((item) => (
          <Sheet.Item
            key={item}
            label={t(`sort.${item}`)}
            left={
              <Icon
                name={SortIcons[item]}
                uniProps={(theme) => ({
                  color: theme.colors[SortColors[item]].accent,
                })}
              />
            }
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
            right={
              item === 'top' ? (
                <Icon
                  name="CaretRight"
                  uniProps={(theme) => ({
                    color: theme.colors.gray.accent,
                    size: theme.space[4],
                  })}
                />
              ) : undefined
            }
            selected={item === sort}
          />
        ))}

        <Sheet.Root ref={sheetInterval}>
          <Sheet.Header title={t('interval.title')} />

          {TopInterval.map((item) => (
            <Sheet.Item
              key={item}
              label={t(`interval.${item}`)}
              left={
                <SymbolIcon
                  name={IntervalIcons[item]}
                  uniProps={($theme) => ({
                    tintColor: $theme.colors.gold.accent,
                  })}
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
        </Sheet.Root>
      </Sheet.Root>
    </>
  )
}
