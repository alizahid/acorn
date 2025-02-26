import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type FloatingButtonSide } from '~/components/common/floating-button'
import { type Font } from '~/lib/fonts'
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
  autoPlay: boolean
  blurNavigation: boolean
  blurNsfw: boolean
  collapseAutoModerator: boolean
  coloredComments: boolean
  communityOnTop: boolean
  dimSeen: boolean
  feedCompact: boolean
  feedMuted: boolean
  feedType: FeedType
  feedbackHaptics: boolean
  feedbackSounds: boolean
  filteredKeywords: Array<string>
  font: Font
  fontScaling: number
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
  refreshInterval: number
  rememberSorting: boolean
  replyPost: FloatingButtonSide
  saveToAlbum: boolean
  seenOnMedia: boolean
  seenOnScroll: boolean
  seenOnVote: boolean
  showFlair: boolean
  skipComment: FloatingButtonSide
  sortCommunityPosts: CommunityFeedSort
  sortFeedPosts: FeedSort
  sortPostComments: CommentSort
  sortSearchPosts: SearchSort
  sortUserComments: CommentSort
  sortUserPosts: UserFeedSort
  stickyDrawer: boolean
  systemScaling: boolean
  theme: Theme
  themeOled: boolean
  themeTint: boolean
  unmuteFullscreen: boolean
  upvoteOnSave: boolean
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
      communityOnTop: false,
      dimSeen: false,
      feedCompact: false,
      feedMuted: true,
      feedType: 'home',
      feedbackHaptics: false,
      feedbackSounds: false,
      filteredKeywords: [],
      font: 'basis',
      fontScaling: 1,
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
      refreshInterval: 10,
      rememberSorting: true,
      replyPost: 'left',
      saveToAlbum: false,
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
      stickyDrawer: true,
      systemScaling: false,
      theme: 'acorn',
      themeOled: false,
      themeTint: true,
      unmuteFullscreen: true,
      update(payload) {
        set(payload)
      },
      upvoteOnSave: true,
    }),
    {
      migrate(persisted, version) {
        const state = persisted as PreferencesPayload

        if (version === 0) {
          state.theme = 'acorn'
        }

        if (version === 2) {
          state.fontScaling = 1
        }

        return state
      },
      name: PREFERENCES_KEY,
      storage: new Store(PREFERENCES_KEY),
      version: 3,
    },
  ),
)
