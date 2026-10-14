import { type SFSymbol } from 'expo-symbols'

import { type IconName } from '~/components/common/icon'
import { type ColorToken } from '~/styles/tokens'
import { type FeedType, type PostSort, type TopInterval } from '~/types/sort'

export const SortIcons = {
  BEST: 'medal',
  COMMENTS: 'chat-centered',
  CONFIDENCE: 'medal',
  CONTROVERSIAL: 'star',
  HOT: 'flame',
  NEW: 'clock',
  OLD: 'package',
  RELEVANCE: 'target',
  RISING: 'trend-up',
  TOP: 'ranking',
} as const satisfies Record<PostSort, IconName>

export const SortColors = {
  BEST: 'green',
  COMMENTS: 'plum',
  CONFIDENCE: 'green',
  CONTROVERSIAL: 'violet',
  HOT: 'red',
  NEW: 'blue',
  OLD: 'gray',
  RELEVANCE: 'green',
  RISING: 'orange',
  TOP: 'gold',
} as const satisfies Record<PostSort, ColorToken>

export const IntervalIcons = {
  ALL: 'infinity.circle.fill',
  DAY: '24.circle.fill',
  HOUR: '1.circle.fill',
  MONTH: '31.circle.fill',
  WEEK: '7.circle.fill',
  YEAR: '12.circle.fill',
} as const satisfies Record<TopInterval, SFSymbol>

export const FeedTypeIcons = {
  all: 'infinity',
  home: 'house',
  popular: 'trend-up',
} as const satisfies Record<FeedType, IconName>

export const FeedTypeColors = {
  all: 'green',
  home: 'blue',
  popular: 'red',
} as const satisfies Record<FeedType, ColorToken>
