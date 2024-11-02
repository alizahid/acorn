import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SortColors, SortIcons } from '~/lib/sort'
import { CommunityFeedSort, FeedSort, UserFeedSort } from '~/types/sort'

import { DropDown } from '../common/drop-down'

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
          color: theme.colors[SortColors[item]].a9,
          name: SortIcons[item],
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
