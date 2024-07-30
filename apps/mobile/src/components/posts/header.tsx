import { type Placement } from '@floating-ui/react-native'
import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import {
  FeedType,
  FeedTypeSubreddit,
  FeedTypeUser,
  TopInterval,
} from '~/hooks/queries/posts/posts'
import { type ColorToken } from '~/styles/colors'

import { DropDown } from '../common/drop-down'
import { type IconName } from '../common/icon'

type FeedTypeMenuProps = {
  hideLabel?: boolean
  onChange: (type: FeedType) => void
  placement?: Placement
  subreddit?: boolean
  type: FeedType
  user?: boolean
}

export function FeedTypeMenu({
  hideLabel,
  onChange,
  placement,
  subreddit,
  type,
  user,
}: FeedTypeMenuProps) {
  const t = useTranslations('component.posts.header')

  const { styles, theme } = useStyles(stylesheet)

  const items = user ? FeedTypeUser : subreddit ? FeedTypeSubreddit : FeedType

  return (
    <DropDown
      hideLabel={hideLabel}
      items={items.map((value) => ({
        icon: {
          color: theme.colors[colors[value]][9],
          name: icons[value],
          weight: 'duotone',
        },
        label: t(`${value}.title`),
        value,
      }))}
      onChange={(next) => {
        onChange(next as FeedType)
      }}
      placeholder={t('placeholder.feed')}
      placement={placement}
      style={styles.main}
      value={type}
    />
  )
}

type TopIntervalMenuProps = {
  hideLabel?: boolean
  interval?: TopInterval
  onChange: (interval: TopInterval) => void
  placement?: Placement
}

export function TopIntervalMenu({
  hideLabel,
  interval = 'hour',
  onChange,
  placement,
}: TopIntervalMenuProps) {
  const t = useTranslations('component.posts.header')

  const { styles } = useStyles(stylesheet)

  return (
    <DropDown
      hideLabel={hideLabel}
      items={TopInterval.map((value) => ({
        label: t(`top.${value}`),
        left: (
          <View style={styles.interval}>
            <Text style={[styles.label, value === 'all' && styles.infinity]}>
              {intervals[value]}
            </Text>
          </View>
        ),
        value,
      }))}
      onChange={(next) => {
        onChange(next as TopInterval)
      }}
      placeholder={t('placeholder.interval')}
      placement={placement}
      style={styles.main}
      value={interval}
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

const icons: Record<FeedType, IconName> = {
  best: 'Medal',
  hot: 'Flame',
  new: 'Clock',
  rising: 'ChartLineUp',
  top: 'Ranking',
}

const colors: Record<FeedType, ColorToken> = {
  best: 'green',
  hot: 'red',
  new: 'blue',
  rising: 'orange',
  top: 'gold',
}

const intervals: Record<TopInterval, string> = {
  all: '∞',
  day: '24',
  hour: '60',
  month: '31',
  week: '7',
  year: '12',
}
