import { type IconName } from '~/components/common/icon'
import { type ColorToken } from '~/styles/tokens'
import {
  type CommentSort,
  type CommunityFeedSort,
  type FeedSort,
  type FeedType,
  type SearchSort,
  type TopInterval,
  type UserFeedSort,
} from '~/types/sort'

type Sort =
  | FeedSort
  | CommunityFeedSort
  | UserFeedSort
  | CommentSort
  | SearchSort

export const SortIcons: Record<Sort, IconName> = {
  best: 'Medal',
  comments: 'ChatCircle',
  confidence: 'Medal',
  controversial: 'Flame',
  hot: 'Flame',
  new: 'Clock',
  old: 'Package',
  relevance: 'Target',
  rising: 'ChartLineUp',
  top: 'Ranking',
}

export const SortColors: Record<Sort, ColorToken> = {
  best: 'green',
  comments: 'plum',
  confidence: 'green',
  controversial: 'red',
  hot: 'red',
  new: 'blue',
  old: 'gray',
  relevance: 'green',
  rising: 'orange',
  top: 'gold',
}

export const IntervalIcons: Record<TopInterval, string> = {
  all: '∞',
  day: '24',
  hour: '60',
  month: '31',
  week: '7',
  year: '12',
}

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
