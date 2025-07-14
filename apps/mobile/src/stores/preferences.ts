import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type FloatingButtonSide } from '~/components/common/floating-button'
import { type Font } from '~/lib/fonts'
import { Store } from '~/lib/store'
import { addTextSize } from '~/styles/text'
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

export const PREFERENCES_KEY = 'preferences-storage'

export type PreferencesPayload = {
  autoPlay: boolean
  blurNavigation: boolean
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
  feedMuted: boolean
  feedType: FeedType
  font: Font
  fontScaling: number
  fontSizeComment: TypographyToken
  fontSizePostTitle: TypographyToken
  fontSizePostBody: TypographyToken
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
  oldReddit: boolean
  pictureInPicture: boolean
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
  stickyDrawer: boolean
  systemScaling: boolean
  theme: Theme
  themeOled: boolean
  themeTint: boolean
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
      blurNavigation: true,
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
      feedMuted: true,
      feedType: 'home',
      font: 'basis',
      fontScaling: 1,
      fontSizeComment: '2',
      fontSizePostBody: '2',
      fontSizePostTitle: '3',
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
      oldReddit: false,
      pictureInPicture: false,
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
      userOnTop: false,
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

        if (version === 3) {
          const { coloredComments } = persisted as {
            coloredComments: boolean
          }

          state.colorfulComments = coloredComments
        }

        if (version === 4) {
          const { fontSizePost } = persisted as {
            fontSizePost: TypographyToken
          }

          state.fontSizePostTitle = fontSizePost
          state.fontSizePostBody = addTextSize(fontSizePost, -1)
        }

        return state
      },
      name: PREFERENCES_KEY,
      storage: new Store(PREFERENCES_KEY),
      version: 5,
    },
  ),
)
