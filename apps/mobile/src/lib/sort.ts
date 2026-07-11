import { type SFSymbol } from 'expo-symbols'

import { type IconName } from '~/components/common/icon'
import { type ColorToken } from '~/styles/tokens'
import { type FeedType, type PostSort, type TopInterval } from '~/types/sort'

export const SortIcons = {
  best: 'medal',
  comments: 'chat-centered',
  confidence: 'medal',
  controversial: 'star',
  hot: 'flame',
  new: 'clock',
  old: 'package',
  relevance: 'target',
  rising: 'trend-up',
  top: 'ranking',
} as const satisfies Record<PostSort, IconName>

export const SortColors = {
  best: 'green',
  comments: 'plum',
  confidence: 'green',
  controversial: 'violet',
  hot: 'red',
  new: 'blue',
  old: 'gray',
  relevance: 'green',
  rising: 'orange',
  top: 'gold',
} as const satisfies Record<PostSort, ColorToken>

export const IntervalIcons = {
  all: 'infinity.circle.fill',
  day: '24.circle.fill',
  hour: '1.circle.fill',
  month: '31.circle.fill',
  week: '7.circle.fill',
  year: '12.circle.fill',
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
