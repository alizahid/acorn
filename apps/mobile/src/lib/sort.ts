import { type SFSymbol } from 'expo-symbols'
import { Platform } from 'react-native'

import { type ColorToken } from '~/styles/tokens'
import { type FeedType, type PostSort, type TopInterval } from '~/types/sort'

export const SortIcons: Record<PostSort, SFSymbol> = {
  best: 'medal',
  comments: (Number(Platform.Version) >= 17) ? 'bubble' : 'bubble.right',
  confidence: 'medal',
  controversial: 'star',
  hot: 'flame',
  new: 'clock',
  old: 'shippingbox',
  relevance: 'target',
  rising: 'chart.line.uptrend.xyaxis',
  top: '1.circle',
}

export const SortColors: Record<PostSort, ColorToken> = {
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
}

export const IntervalIcons: Record<TopInterval, SFSymbol> = {
  all: 'infinity.circle.fill',
  day: '24.circle.fill',
  hour: '1.circle.fill',
  month: '31.circle.fill',
  week: '7.circle.fill',
  year: '12.circle.fill',
}

export const FeedTypeIcons: Record<FeedType, SFSymbol> = {
  all: 'balloon',
  home: 'house',
  popular: 'chart.line.uptrend.xyaxis',
}

export const FeedTypeColors: Record<FeedType, ColorToken> = {
  all: 'green',
  home: 'accent',
  popular: 'red',
}
