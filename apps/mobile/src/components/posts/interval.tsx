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
  const t = useTranslations('component.common.interval')

  const { styles } = useStyles(stylesheet)

  return (
    <DropDown
      hideLabel={hideLabel}
      items={TopInterval.map((item) => ({
        label: t(item),
        left: <TopIntervalItem item={item} />,
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

type ItemProps = {
  item: TopInterval
  size?: number
}

export function TopIntervalItem({ item, size }: ItemProps) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={styles.interval(size ?? theme.space[4])}>
      <Text
        style={[
          styles.label(size ?? theme.space[4]),
          item === 'all' && styles.infinity,
        ]}
      >
        {intervals[item]}
      </Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  infinity: {
    fontSize: theme.space[3],
  },
  interval: (size: number) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.gold[9],
    borderCurve: 'continuous',
    borderRadius: size,
    height: size,
    justifyContent: 'center',
    width: size,
  }),
  label: (size: number) => ({
    color: theme.colors.gold.contrast,
    fontFamily: 'sans',
    fontSize: size / 2,
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
    textAlign: 'center',
  }),
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
