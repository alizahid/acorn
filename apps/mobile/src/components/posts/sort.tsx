import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/colors'
import { CommunityFeedSort, FeedSort, UserFeedSort } from '~/types/sort'

import { DropDown } from '../common/drop-down'
import { type IconName } from '../common/icon'

type SortType = 'home' | 'community' | 'user'

type SortMap = {
  community: CommunityFeedSort
  home: FeedSort
  user: UserFeedSort
}

type Props<Type extends SortType> = {
  hideLabel?: boolean
  onChange: (value: SortMap[Type]) => void
  type?: Type
  value: SortMap[Type]
}

export function FeedSortMenu<Type extends SortType>({
  hideLabel,
  onChange,
  type,
  value,
}: Props<Type>) {
  const t = useTranslations('component.common.sort')

  const { styles, theme } = useStyles(stylesheet)

  const items =
    type === 'user'
      ? UserFeedSort
      : type === 'community'
        ? CommunityFeedSort
        : FeedSort

  return (
    <DropDown
      hideLabel={hideLabel}
      items={items.map((item) => ({
        icon: {
          color: theme.colors[FeedSortColors[item]][9],
          name: FeedSortIcons[item],
          weight: 'duotone',
        },
        label: t(item),
        value: item,
      }))}
      onChange={(next) => {
        onChange(next as SortMap[Type])
      }}
      placeholder={t('placeholder')}
      style={styles.main}
      value={value}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
  },
}))

export const FeedSortIcons: Record<FeedSort, IconName> = {
  best: 'Medal',
  hot: 'Flame',
  new: 'Clock',
  rising: 'ChartLineUp',
  top: 'Ranking',
}

export const FeedSortColors: Record<FeedSort, ColorToken> = {
  best: 'green',
  hot: 'red',
  new: 'blue',
  rising: 'orange',
  top: 'gold',
}
