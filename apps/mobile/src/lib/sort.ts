import { type IconName } from '~/components/common/icon'
import { type ColorToken } from '~/styles/colors'
import {
  type CommentSort,
  type CommunityFeedSort,
  type FeedSort,
  type SearchSort,
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
  comments: 'ChatCentered',
  confidence: 'Medal',
  controversial: 'Flame',
  hot: 'Flame',
  new: 'Clock',
  old: 'Archive',
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
