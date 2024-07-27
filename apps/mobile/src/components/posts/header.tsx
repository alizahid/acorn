import ChartLineUpIcon from 'react-native-phosphor/src/duotone/ChartLineUp'
import ClockIcon from 'react-native-phosphor/src/duotone/Clock'
import FireIcon from 'react-native-phosphor/src/duotone/Fire'
import MedalIcon from 'react-native-phosphor/src/duotone/Medal'
import RankingIcon from 'react-native-phosphor/src/duotone/Ranking'
import { type Icon } from 'react-native-phosphor/src/lib'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { FeedType, FeedTypeSubreddit } from '~/hooks/queries/posts/posts'

import { DropDown } from '../common/drop-down'

type Props = {
  onChange: (type: FeedType) => void
  subreddit?: boolean
  type: FeedType
}

export function PostHeader({ onChange, subreddit, type }: Props) {
  const t = useTranslations('component.posts.header')

  const { styles, theme } = useStyles(stylesheet)

  const items = subreddit ? FeedTypeSubreddit : FeedType

  return (
    <DropDown
      items={items.map((value) => {
        const Icon = icons[value]

        return {
          icon: <Icon color={theme.colors[colors[value]][9]} size={20} />,
          label: t(value),
          value,
        }
      })}
      onChange={(next) => {
        onChange(next as FeedType)
      }}
      placeholder={t('title')}
      style={styles.main}
      value={type}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    height: theme.space[8],
    paddingHorizontal: theme.space[4],
  },
}))

const icons: Record<FeedType, Icon> = {
  best: MedalIcon,
  hot: FireIcon,
  new: ClockIcon,
  rising: ChartLineUpIcon,
  top: RankingIcon,
}

const colors = {
  best: 'green',
  hot: 'red',
  new: 'blue',
  rising: 'orange',
  top: 'gold',
} as const satisfies Record<FeedType, string>
