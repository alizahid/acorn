import { useTranslations } from 'use-intl'

import { SortColors, SortIcons } from '~/lib/sort'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  type PostSort,
  SearchSort,
  type SortType,
  UserFeedSort,
} from '~/types/sort'

import { Icon } from '../common/icon'
import { Menu } from '../common/menu'

type Props<Type extends PostSort> = {
  label: string
  onChange: (value: Type) => void
  value: Type
  type: SortType
}

export function SortItem<Type extends PostSort>({
  label,
  onChange,
  type,
  value,
}: Props<Type>) {
  const t = useTranslations('component.common')

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
    <Menu.Options<Type>
      icon={<Icon name="triangle" />}
      label={label}
      onChange={onChange}
      options={items.map((item) => ({
        label: t(`sort.${item}`),
        right: (
          <Icon
            name={SortIcons[item]}
            uniProps={(theme) => ({
              tintColor: theme.colors[SortColors[item]].accent,
            })}
          />
        ),
        value: item as Type,
      }))}
      value={value}
    />
  )
}
