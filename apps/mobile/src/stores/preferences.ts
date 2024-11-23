import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type GestureAction } from '~/components/posts/gestures'
import { Store } from '~/lib/store'
import { type Theme } from '~/styles/themes'
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
  collapseAutoModerator: boolean
  coloredComments: boolean
  dimSeen: boolean
  feedCompact: boolean
  feedMuted: boolean
  feedType: FeedType
  feedbackHaptics: boolean
  feedbackSounds: boolean
  fontScaling: boolean
  fontSystem: boolean
  hideSeen: boolean
  intervalCommunityPosts: TopInterval
  intervalFeedPosts: TopInterval
  intervalSearchPosts: TopInterval
  intervalUserComments: TopInterval
  intervalUserPosts: TopInterval
  largeThumbnails: boolean
  linkBrowser: boolean
  mediaOnRight: boolean
  rememberCommunitySort: boolean
  seenOnMedia: boolean
  seenOnScroll: boolean
  seenOnVote: boolean
  showFlair: boolean
  skipCommentOnLeft: boolean
  sortCommunityPosts: CommunityFeedSort
  sortFeedPosts: FeedSort
  sortPostComments: CommentSort
  sortSearchPosts: SearchSort
  sortUserComments: CommentSort
  sortUserPosts: UserFeedSort
  swipeGestures: boolean
  swipeLeftLong: NonNullable<GestureAction>
  swipeLeftShort: NonNullable<GestureAction>
  swipeRightLong: NonNullable<GestureAction>
  swipeRightShort: NonNullable<GestureAction>
  theme: Theme
  unmuteFullscreen: boolean
}

type State = PreferencesPayload & {
  update: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      blurNsfw: true,
      collapseAutoModerator: false,
      coloredComments: true,
      dimSeen: false,
      feedCompact: false,
      feedMuted: true,
      feedType: 'home',
      feedbackHaptics: false,
      feedbackSounds: false,
      fontScaling: false,
      fontSystem: false,
      hideSeen: false,
      intervalCommunityPosts: 'hour',
      intervalFeedPosts: 'hour',
      intervalSearchPosts: 'all',
      intervalUserComments: 'all',
      intervalUserPosts: 'all',
      largeThumbnails: false,
      linkBrowser: true,
      mediaOnRight: true,
      rememberCommunitySort: false,
      seenOnMedia: false,
      seenOnScroll: false,
      seenOnVote: false,
      showFlair: true,
      skipCommentOnLeft: false,
      sortCommunityPosts: 'hot',
      sortFeedPosts: 'hot',
      sortPostComments: 'confidence',
      sortSearchPosts: 'relevance',
      sortUserComments: 'new',
      sortUserPosts: 'new',
      swipeGestures: true,
      swipeLeftLong: 'downvote',
      swipeLeftShort: 'upvote',
      swipeRightLong: 'save',
      swipeRightShort: 'reply',
      theme: 'acorn',
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
