import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { type FeedType, type TopInterval } from '~/hooks/queries/posts/posts'
import { Store } from '~/lib/store'

export const PREFERENCES_KEY = 'preferences-storage'

export type PreferencesPayload = {
  feed: FeedType
  interval?: TopInterval
  muted: boolean
}

type State = PreferencesPayload & {
  updatePreferences: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      feed: 'best',
      muted: true,
      updatePreferences(payload) {
        set(payload)
      },
    }),
    {
      name: PREFERENCES_KEY,
      storage: createJSONStorage(() => new Store(PREFERENCES_KEY)),
    },
  ),
)
