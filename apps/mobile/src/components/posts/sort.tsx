import { type Placement } from '@floating-ui/react-native'
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
  placement?: Placement
  type?: Type
  value: SortMap[Type]
}

export function FeedSortMenu<Type extends SortType = 'home'>({
  hideLabel,
  onChange,
  placement,
  type,
  value,
}: Props<Type>) {
  const t = useTranslations('component.posts.header')

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
          color: theme.colors[colors[item]][9],
          name: icons[item],
          weight: 'duotone',
        },
        label: t(`${item}.title`),
        value: item,
      }))}
      onChange={(next) => {
        onChange(next as SortMap[Type])
      }}
      placeholder={t('placeholder.feed')}
      placement={placement}
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

const icons: Record<FeedSort, IconName> = {
  best: 'Medal',
  hot: 'Flame',
  new: 'Clock',
  rising: 'ChartLineUp',
  top: 'Ranking',
}

const colors: Record<FeedSort, ColorToken> = {
  best: 'green',
  hot: 'red',
  new: 'blue',
  rising: 'orange',
  top: 'gold',
}
