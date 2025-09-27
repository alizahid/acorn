import { type SFSymbol } from 'expo-symbols'

import { type ColorToken } from '~/styles/tokens'
import { type FeedType, type PostSort, type TopInterval } from '~/types/sort'

export const SortIcons = {
  best: 'medal',
  comments: 'bubble',
  confidence: 'medal',
  controversial: 'star',
  hot: 'flame',
  new: 'clock',
  old: 'shippingbox',
  relevance: 'target',
  rising: 'chart.line.uptrend.xyaxis',
  top: '1.circle',
} as const satisfies Record<PostSort, SFSymbol>

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
  all: 'balloon',
  home: 'house',
  popular: 'chart.line.uptrend.xyaxis',
} as const satisfies Record<FeedType, SFSymbol>

export const FeedTypeColors = {
  all: 'green',
  home: 'accent',
  popular: 'red',
} as const satisfies Record<FeedType, ColorToken>
