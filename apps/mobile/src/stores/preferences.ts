import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Store } from '~/lib/store'
import {
  type CommentSort,
  type CommunityFeedSort,
  type FeedSort,
  type TopInterval,
  type UserFeedSort,
} from '~/types/sort'

export const PREFERENCES_KEY = 'preferences-storage'

export type PreferencesPayload = {
  blurNsfw: boolean
  communityInterval: TopInterval
  communitySort: CommunityFeedSort
  feedInterval: TopInterval
  feedMuted: boolean
  feedSort: FeedSort
  linkBrowser: boolean
  postCommentSort: CommentSort
  userCommentSort: CommentSort
  userInterval: TopInterval
  userSort: UserFeedSort
}

type State = PreferencesPayload & {
  update: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      blurNsfw: true,
      communityInterval: 'hour',
      communitySort: 'hot',
      feedInterval: 'hour',
      feedMuted: true,
      feedSort: 'hot',
      linkBrowser: true,
      postCommentSort: 'confidence',
      update(payload) {
        set(payload)
      },
      userCommentSort: 'new',
      userInterval: 'hour',
      userSort: 'new',
    }),
    {
      name: PREFERENCES_KEY,
      storage: createJSONStorage(() => new Store(PREFERENCES_KEY)),
    },
  ),
)
