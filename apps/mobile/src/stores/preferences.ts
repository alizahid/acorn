import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Store } from '~/lib/store'
import {
  type CommentSort,
  type CommunityFeedSort,
  type FeedSort,
  type FeedType,
  type SearchSort,
  type TopInterval,
  type UserFeedSort,
} from '~/types/sort'

export const PREFERENCES_KEY = 'preferences-storage'

export type PreferencesPayload = {
  blurNsfw: boolean
  dimSeen: boolean
  feedCompact: boolean
  feedMuted: boolean
  feedType: FeedType
  fontScaling: boolean
  gestures: boolean
  hideSeen: boolean
  intervalCommunityPosts: TopInterval
  intervalFeedPosts: TopInterval
  intervalSearchPosts: TopInterval
  intervalUserComments: TopInterval
  intervalUserPosts: TopInterval
  linkBrowser: boolean
  mediaOnRight: boolean
  rememberCommunitySort: boolean
  seenOnMedia: boolean
  seenOnScroll: boolean
  seenOnVote: boolean
  showFlair: boolean
  sortCommunityPosts: CommunityFeedSort
  sortFeedPosts: FeedSort
  sortPostComments: CommentSort
  sortSearchPosts: SearchSort
  sortUserComments: CommentSort
  sortUserPosts: UserFeedSort
  unmuteFullscreen: boolean
}

type State = PreferencesPayload & {
  update: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      blurNsfw: true,
      dimSeen: false,
      feedCompact: false,
      feedMuted: true,
      feedType: 'home',
      fontScaling: false,
      gestures: true,
      hideSeen: false,
      intervalCommunityPosts: 'hour',
      intervalFeedPosts: 'hour',
      intervalSearchPosts: 'all',
      intervalUserComments: 'all',
      intervalUserPosts: 'all',
      linkBrowser: true,
      mediaOnRight: true,
      rememberCommunitySort: false,
      seenOnMedia: false,
      seenOnScroll: false,
      seenOnVote: false,
      showFlair: true,
      sortCommunityPosts: 'hot',
      sortFeedPosts: 'hot',
      sortPostComments: 'confidence',
      sortSearchPosts: 'relevance',
      sortUserComments: 'new',
      sortUserPosts: 'new',
      unmuteFullscreen: true,
      update(payload) {
        set(payload)
      },
    }),
    {
      name: PREFERENCES_KEY,
      storage: new Store(PREFERENCES_KEY),
    },
  ),
)
