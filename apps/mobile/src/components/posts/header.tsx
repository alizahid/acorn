import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import {
  FeedType,
  FeedTypeSubreddit,
  TopInterval,
} from '~/hooks/queries/posts/posts'
import { type ColorToken } from '~/styles/colors'

import { DropDown } from '../common/drop-down'
import { type IconName } from '../common/icon'

type FeedTypeMenuProps = {
  onChange: (type: FeedType) => void
  subreddit?: boolean
  type: FeedType
}

export function FeedTypeMenu({ onChange, subreddit, type }: FeedTypeMenuProps) {
  const t = useTranslations('component.posts.header')

  const { styles, theme } = useStyles(stylesheet)

  const items = subreddit ? FeedTypeSubreddit : FeedType

  return (
    <DropDown
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
      style={styles.main}
      value={type}
    />
  )
}

type TopIntervalMenuProps = {
  interval?: TopInterval
  onChange: (interval: TopInterval) => void
}

export function TopIntervalMenu({
  interval = 'hour',
  onChange,
}: TopIntervalMenuProps) {
  const t = useTranslations('component.posts.header')

  const { styles } = useStyles(stylesheet)

  return (
    <DropDown
      items={TopInterval.map((value) => ({
        label: t(`top.${value}`),
        value,
      }))}
      onChange={(next) => {
        onChange(next as TopInterval)
      }}
      placeholder={t('placeholder.interval')}
      style={styles.main}
      value={interval}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
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
