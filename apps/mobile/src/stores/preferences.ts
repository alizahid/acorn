import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { type FeedType } from '~/hooks/queries/posts/posts'
import { Store } from '~/lib/store'

export type PreferencesPayload = {
  feed: FeedType
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
      name: 'preferences-storage',
      storage: createJSONStorage(() => new Store()),
    },
  ),
)
