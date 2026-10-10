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
  UserFeedSort,
} from '~/types/sort'

const PREFERENCES_KEY = 'preferences'

const SORT_KEYS = [
  'intervalCommunityPosts',
  'intervalFeedPosts',
  'intervalSearchPosts',
  'intervalUserComments',
  'intervalUserPosts',
  'sortCommunityPosts',
  'sortFeedPosts',
  'sortPostComments',
  'sortSearchPosts',
  'sortUserComments',
  'sortUserPosts',
] as const satisfies ReadonlyArray<keyof PreferencesPayload>

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
  drawerLeft: boolean
  drawerSticky: boolean
  feedbackHaptics: boolean
  feedbackSounds: boolean
  feedCompact: boolean
  feedMuted: boolean
  feedType: FeedType
  font: Font
  fontBold: boolean
  fontScaling: number
  fontSizeCommentBody: TypographyToken
  fontSizePostBody: TypographyToken
  fontSizeTitle: TypographyToken
  gallerySnap: boolean
  hapticsLoud: boolean
  hideCommunityName: boolean
  hidePostActions: boolean
  hideSeen: boolean
  hideUserName: boolean
  highContrastBackground: boolean
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
  sortUserComments: UserFeedSort
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
      drawerLeft: false,
      drawerSticky: true,
      feedbackHaptics: false,
      feedbackSounds: false,
      feedCompact: false,
      feedMuted: true,
      feedType: 'home',
      font: 'basis',
      fontBold: false,
      fontScaling: 1,
      fontSizeCommentBody: '2',
      fontSizePostBody: '3',
      fontSizeTitle: '3',
      gallerySnap: true,
      hapticsLoud: false,
      hideCommunityName: false,
      hidePostActions: false,
      hideSeen: false,
      hideUserName: false,
      highContrastBackground: false,
      infiniteScrolling: true,
      intervalCommunityPosts: 'HOUR',
      intervalFeedPosts: 'HOUR',
      intervalSearchPosts: 'ALL',
      intervalUserComments: 'ALL',
      intervalUserPosts: 'ALL',
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
      sortCommunityPosts: 'HOT',
      sortFeedPosts: 'HOT',
      sortPostComments: 'CONFIDENCE',
      sortSearchPosts: 'RELEVANCE',
      sortUserComments: 'NEW',
      sortUserPosts: 'NEW',
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
      migrate(state, version) {
        // sorts and intervals were stored lowercase before they became Reddit's
        // own values
        if (version < 1) {
          const previous = state as Record<string, unknown>

          for (const key of SORT_KEYS) {
            const value = previous[key]

            if (typeof value === 'string') {
              previous[key] = value.toUpperCase()
            }
          }

          // a user's comments only sort like their posts
          if (
            !UserFeedSort.includes(previous.sortUserComments as UserFeedSort)
          ) {
            previous.sortUserComments = 'NEW'
          }
        }

        return state as State
      },
      name: PREFERENCES_KEY,
      storage: new Store(),
      version: 1,
    },
  ),
)
