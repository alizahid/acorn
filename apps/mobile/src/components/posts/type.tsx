import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/colors'
import { FeedType } from '~/types/sort'

import { DropDown } from '../common/drop-down'
import { type IconName } from '../common/icon'

type Props = {
  hideLabel?: boolean
  onChange: (value: FeedType) => void
  value: FeedType
}

export function FeedTypeMenu({ hideLabel, onChange, value }: Props) {
  const t = useTranslations('component.common.type')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <DropDown
      hideLabel={hideLabel}
      items={FeedType.map((item) => ({
        icon: {
          color: theme.colors[FeedTypeColors[item]].a9,
          name: FeedTypeIcons[item],
          weight: 'duotone',
        },
        label: t(item),
        value: item,
      }))}
      onChange={(next) => {
        onChange(next as FeedType)
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

export const FeedTypeIcons: Record<FeedType, IconName> = {
  all: 'Balloon',
  home: 'House',
  popular: 'ChartLineUp',
}

export const FeedTypeColors: Record<FeedType, ColorToken> = {
  all: 'green',
  home: 'accent',
  popular: 'red',
}
