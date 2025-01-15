import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type Gestures } from '~/components/common/gestures'
import { Store } from '~/lib/store'
import { type Theme } from '~/styles/themes'
import { type Side } from '~/types/preferences'
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
  autoPlay: boolean
  blurNavigation: boolean
  blurNsfw: boolean
  collapseAutoModerator: boolean
  coloredComments: boolean
  commentGestures: Gestures
  dimSeen: boolean
  feedCompact: boolean
  feedMuted: boolean
  feedType: FeedType
  feedbackHaptics: boolean
  feedbackSounds: boolean
  fontScaling: boolean
  fontSystem: boolean
  hapticsLoud: boolean
  hideSeen: boolean
  intervalCommunityPosts: TopInterval
  intervalFeedPosts: TopInterval
  intervalSearchPosts: TopInterval
  intervalUserComments: TopInterval
  intervalUserPosts: TopInterval
  largeThumbnails: boolean
  linkBrowser: boolean
  mediaOnRight: boolean
  oldReddit: boolean
  postGestures: Gestures
  refreshInterval: number
  replyPost: Side
  seenOnMedia: boolean
  seenOnScroll: boolean
  seenOnVote: boolean
  showFlair: boolean
  skipComment: Side
  sortCommunityPosts: CommunityFeedSort
  sortFeedPosts: FeedSort
  sortPostComments: CommentSort
  sortSearchPosts: SearchSort
  sortUserComments: CommentSort
  sortUserPosts: UserFeedSort
  swipeGestures: boolean
  theme: Theme
  unmuteFullscreen: boolean
}

type State = PreferencesPayload & {
  update: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      autoPlay: true,
      blurNavigation: true,
      blurNsfw: true,
      collapseAutoModerator: false,
      coloredComments: true,
      commentGestures: {
        leftLong: 'downvote',
        leftShort: 'upvote',
        rightLong: 'save',
        rightShort: 'reply',
      },
      dimSeen: false,
      feedCompact: false,
      feedMuted: true,
      feedType: 'home',
      feedbackHaptics: false,
      feedbackSounds: false,
      fontScaling: false,
      fontSystem: false,
      hapticsLoud: false,
      hideSeen: false,
      intervalCommunityPosts: 'hour',
      intervalFeedPosts: 'hour',
      intervalSearchPosts: 'all',
      intervalUserComments: 'all',
      intervalUserPosts: 'all',
      largeThumbnails: false,
      linkBrowser: true,
      mediaOnRight: true,
      oldReddit: false,
      postGestures: {
        leftLong: 'downvote',
        leftShort: 'upvote',
        rightLong: 'save',
        rightShort: 'reply',
      },
      refreshInterval: 10,
      replyPost: 'left',
      seenOnMedia: false,
      seenOnScroll: false,
      seenOnVote: false,
      showFlair: true,
      skipComment: 'right',
      sortCommunityPosts: 'hot',
      sortFeedPosts: 'hot',
      sortPostComments: 'confidence',
      sortSearchPosts: 'relevance',
      sortUserComments: 'new',
      sortUserPosts: 'new',
      swipeGestures: true,
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
