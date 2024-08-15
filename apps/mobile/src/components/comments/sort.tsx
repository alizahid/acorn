import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/colors'
import { CommentSort } from '~/types/sort'

import { DropDown } from '../common/drop-down'
import { type IconName } from '../common/icon'

type Props = {
  onChange: (value: CommentSort) => void
  value: CommentSort
}

export function CommentsSortMenu({ onChange, value }: Props) {
  const t = useTranslations('component.common.sort')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <DropDown
      hideLabel
      items={CommentSort.map((item) => ({
        icon: {
          color: theme.colors[CommentSortColors[item]][9],
          name: CommentSortIcons[item],
          weight: 'duotone',
        },
        label: t(item),
        value: item,
      }))}
      onChange={(next) => {
        onChange(next as CommentSort)
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

export const CommentSortIcons: Record<CommentSort, IconName> = {
  confidence: 'Medal',
  controversial: 'Flame',
  new: 'Clock',
  old: 'Archive',
  top: 'Ranking',
}

export const CommentSortColors: Record<CommentSort, ColorToken> = {
  confidence: 'green',
  controversial: 'red',
  new: 'blue',
  old: 'gray',
  top: 'gold',
}
