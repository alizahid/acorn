import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/colors'
import { CommentFeedSort } from '~/types/sort'

import { DropDown } from '../common/drop-down'
import { type IconName } from '../common/icon'

type Props = {
  onChange: (value: CommentFeedSort) => void
  value: CommentFeedSort
}

export function CommentsSortMenu({ onChange, value }: Props) {
  const t = useTranslations('component.comments.sort')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <DropDown
      hideLabel
      items={CommentFeedSort.map((item) => ({
        icon: {
          color: theme.colors[colors[item]][9],
          name: icons[item],
          weight: 'duotone',
        },
        label: t(item),
        value: item,
      }))}
      onChange={(next) => {
        onChange(next as CommentFeedSort)
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

const icons: Record<CommentFeedSort, IconName> = {
  confidence: 'Medal',
  controversial: 'Flame',
  new: 'Clock',
  old: 'Archive',
  top: 'Ranking',
}

const colors: Record<CommentFeedSort, ColorToken> = {
  confidence: 'green',
  controversial: 'red',
  new: 'blue',
  old: 'gray',
  top: 'gold',
}
