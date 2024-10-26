import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Store } from '~/lib/store'
import {
  type CommentSort,
  type CommunityFeedSort,
  type FeedSort,
  type FeedType,
  type TopInterval,
  type UserFeedSort,
} from '~/types/sort'

export const PREFERENCES_KEY = 'preferences-storage'

export type PreferencesPayload = {
  blurNsfw: boolean
  dimSeen: boolean
  feedMuted: boolean
  feedType: FeedType
  fontScaling: boolean
  hideSeen: boolean
  intervalCommunityPosts: TopInterval
  intervalFeedPosts: TopInterval
  intervalUserComments: TopInterval
  intervalUserPosts: TopInterval
  linkBrowser: boolean
  sortCommunityPosts: CommunityFeedSort
  sortFeedPosts: FeedSort
  sortPostComments: CommentSort
  sortUserComments: CommentSort
  sortUserPosts: UserFeedSort
}

type State = PreferencesPayload & {
  update: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      blurNsfw: true,
      dimSeen: false,
      feedMuted: true,
      feedType: 'home',
      fontScaling: false,
      hideSeen: false,
      intervalCommunityPosts: 'hour',
      intervalFeedPosts: 'hour',
      intervalUserComments: 'all',
      intervalUserPosts: 'all',
      linkBrowser: true,
      sortCommunityPosts: 'hot',
      sortFeedPosts: 'hot',
      sortPostComments: 'confidence',
      sortUserComments: 'new',
      sortUserPosts: 'new',
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
