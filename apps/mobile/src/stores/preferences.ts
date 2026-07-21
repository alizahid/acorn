import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type FloatingButtonSide } from '~/components/common/floating-button'
import { type Font } from '~/lib/fonts'
import { Store } from '~/lib/store'
import { type Theme } from '~/styles/themes'
import { type TypographyToken } from '~/styles/tokens'
import {
  type CommentSort,
  type CommunityFeedSort,
  type FeedSort,
  type FeedType,
  type SearchSort,
  type TopInterval,
  type UserFeedSort,
} from '~/types/sort'

const PREFERENCES_KEY = 'preferences'

export type PreferencesPayload = {
  autoPlay: boolean
  blurNsfw: boolean
  blurSpoiler: boolean
  boldTitle: boolean
  collapseAutoModerator: boolean
  collapsibleComments: boolean
  colorfulComments: boolean
  communityOnTop: boolean
  dimSeen: boolean
  feedbackHaptics: boolean
  feedbackSounds: boolean
  feedCompact: boolean
  feedType: FeedType
  font: Font
  fontScaling: number
  fontSizeCommentBody: TypographyToken
  fontSizePostBody: TypographyToken
  fontSizeTitle: TypographyToken
  hapticsLoud: boolean
  hidePostActions: boolean
  hideSeen: boolean
  infiniteScrolling: boolean
  intervalCommunityPosts: TopInterval
  intervalFeedPosts: TopInterval
  intervalSearchPosts: TopInterval
  intervalUserComments: TopInterval
  intervalUserPosts: TopInterval
  largeThumbnails: boolean
  linkBrowser: boolean
  mediaOnRight: boolean
  minimizeTabBar: boolean
  oldReddit: boolean
  pictureInPicture: boolean
  privateScreenshots: boolean
  refreshInterval: number
  rememberSorting: boolean
  replyPost: FloatingButtonSide
  saveToAlbum: boolean
  seenOnMedia: boolean
  seenOnScroll: boolean
  seenOnScrollDelay: number
  seenOnVote: boolean
  showFlair: boolean
  skipComment: FloatingButtonSide
  sortCommunityPosts: CommunityFeedSort
  sortFeedPosts: FeedSort
  sortPostComments: CommentSort
  sortSearchPosts: SearchSort
  sortUserComments: CommentSort
  sortUserPosts: UserFeedSort
  systemScaling: boolean
  theme: Theme
  unmuteFullscreen: boolean
  upvoteOnSave: boolean
  userOnTop: boolean
}

type State = PreferencesPayload & {
  update: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      autoPlay: true,
      blurNsfw: true,
      blurSpoiler: true,
      boldTitle: true,
      collapseAutoModerator: false,
      collapsibleComments: true,
      colorfulComments: true,
      communityOnTop: false,
      dimSeen: false,
      feedbackHaptics: false,
      feedbackSounds: false,
      feedCompact: false,
      feedType: 'home',
      font: 'basis',
      fontScaling: 1,
      fontSizeCommentBody: '2',
      fontSizePostBody: '3',
      fontSizeTitle: '3',
      hapticsLoud: false,
      hidePostActions: false,
      hideSeen: false,
      infiniteScrolling: true,
      intervalCommunityPosts: 'hour',
      intervalFeedPosts: 'hour',
      intervalSearchPosts: 'all',
      intervalUserComments: 'all',
      intervalUserPosts: 'all',
      largeThumbnails: false,
      linkBrowser: true,
      mediaOnRight: true,
      minimizeTabBar: false,
      oldReddit: false,
      pictureInPicture: false,
      privateScreenshots: true,
      refreshInterval: 10,
      rememberSorting: true,
      replyPost: 'left',
      saveToAlbum: false,
      seenOnMedia: false,
      seenOnScroll: false,
      seenOnScrollDelay: 0,
      seenOnVote: false,
      showFlair: true,
      skipComment: 'right',
      sortCommunityPosts: 'hot',
      sortFeedPosts: 'hot',
      sortPostComments: 'confidence',
      sortSearchPosts: 'relevance',
      sortUserComments: 'new',
      sortUserPosts: 'new',
      systemScaling: false,
      theme: 'acorn',
      unmuteFullscreen: true,
      update(payload) {
        set(payload)
      },
      upvoteOnSave: true,
      userOnTop: false,
    }),
    {
      name: PREFERENCES_KEY,
      storage: new Store(),
    },
  ),
)
