import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SortColors, SortIcons } from '~/lib/sort'
import { CommentSort } from '~/types/sort'

import { DropDown } from '../common/drop-down'

type Props = {
  hideLabel?: boolean
  onChange: (value: CommentSort) => void
  value: CommentSort
}

export function CommentsSortMenu({ hideLabel, onChange, value }: Props) {
  const t = useTranslations('component.common.sort')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <DropDown
      hideLabel={hideLabel}
      items={CommentSort.map((item) => ({
        icon: {
          color: theme.colors[SortColors[item]][9],
          name: SortIcons[item],
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
