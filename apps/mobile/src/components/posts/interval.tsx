import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { TopInterval } from '~/types/sort'

import { DropDown } from '../common/drop-down'

type Props = {
  hideLabel?: boolean
  onChange: (value: TopInterval) => void
  value?: TopInterval
}

export function TopIntervalMenu({ hideLabel, onChange, value }: Props) {
  const t = useTranslations('component.posts.interval')

  const { styles } = useStyles(stylesheet)

  return (
    <DropDown
      hideLabel={hideLabel}
      items={TopInterval.map((item) => ({
        label: t(item),
        left: (
          <View style={styles.interval}>
            <Text style={[styles.label, item === 'all' && styles.infinity]}>
              {intervals[item]}
            </Text>
          </View>
        ),
        value: item,
      }))}
      onChange={(next) => {
        onChange(next as TopInterval)
      }}
      placeholder={t('placeholder')}
      style={styles.main}
      value={value}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  infinity: {
    fontSize: theme.space[3],
  },
  interval: {
    alignItems: 'center',
    backgroundColor: theme.colors.gold[9],
    borderRadius: theme.space[4],
    height: theme.space[4],
    justifyContent: 'center',
    width: theme.space[4],
  },
  label: {
    color: theme.colors.gold.contrast,
    fontFamily: 'medium',
    fontSize: theme.space[2],
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  main: {
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
  },
}))

const intervals: Record<TopInterval, string> = {
  all: '∞',
  day: '24',
  hour: '60',
  month: '31',
  week: '7',
  year: '12',
}
