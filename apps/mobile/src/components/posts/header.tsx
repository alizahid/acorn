import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { FeedType, FeedTypeSubreddit } from '~/hooks/queries/posts/posts'

import { DropDown } from '../common/drop-down'
import { Icon, type IconName } from '../common/icon'

type Props = {
  hideLabel?: boolean
  onChange: (type: FeedType) => void
  subreddit?: boolean
  type: FeedType
}

export function PostHeader({ hideLabel, onChange, subreddit, type }: Props) {
  const t = useTranslations('component.posts.header')

  const { styles, theme } = useStyles(stylesheet)

  const items = subreddit ? FeedTypeSubreddit : FeedType

  return (
    <DropDown
      hideLabel={hideLabel}
      items={items.map((value) => ({
        icon: (
          <Icon
            color={theme.colors[colors[value]][9]}
            name={icons[value]}
            size={theme.typography[3].lineHeight}
            weight="duotone"
          />
        ),
        label: t(value),
        value,
      }))}
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

const icons: Record<FeedType, IconName> = {
  best: 'Medal',
  hot: 'Flame',
  new: 'Clock',
  rising: 'ChartLineUp',
  top: 'Ranking',
}

const colors = {
  best: 'green',
  hot: 'red',
  new: 'blue',
  rising: 'orange',
  top: 'gold',
} as const satisfies Record<FeedType, string>
