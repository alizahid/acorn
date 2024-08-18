import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SortColors, SortIcons } from '~/lib/sort'
import { SearchSort, TopInterval } from '~/types/sort'

import { DropDown } from '../common/drop-down'
import { View } from '../common/view'
import { TopIntervalItem } from '../posts/interval'

export type SearchFilters = {
  interval?: TopInterval
  sort?: SearchSort
}

export type Props = {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  style?: StyleProp<ViewStyle>
}

export function SearchPostFilters({ filters, onChange, style }: Props) {
  const t = useTranslations('component.search.filters')
  const tSort = useTranslations('component.common.sort')
  const tInterval = useTranslations('component.common.interval')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View
      direction="row"
      gap="4"
      justify="between"
      style={[styles.main, style]}
    >
      <DropDown
        items={SearchSort.map((item) => ({
          icon: {
            color: theme.colors[SortColors[item]][9],
            name: SortIcons[item],
            weight: 'duotone',
          },
          label: tSort(item),
          value: item,
        }))}
        onChange={(next) => {
          onChange({
            ...filters,
            sort: next as SearchSort,
          })
        }}
        placeholder={t('sort.placeholder')}
        style={styles.item}
        value={filters.sort}
      />

      <DropDown
        items={TopInterval.toReversed().map((item) => ({
          label: tInterval(item),
          left: <TopIntervalItem item={item} />,
          value: item,
        }))}
        onChange={(next) => {
          onChange({
            ...filters,
            interval: next as TopInterval,
          })
        }}
        placeholder={t('interval.placeholder')}
        style={styles.item}
        value={filters.interval}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  item: {
    height: theme.space[8],
    paddingHorizontal: theme.space[2],
  },
  main: {
    backgroundColor: theme.colors.gray.a2,
  },
}))
