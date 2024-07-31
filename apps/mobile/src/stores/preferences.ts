import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Store } from '~/lib/store'
import { type FeedSort, type TopInterval } from '~/types/sort'

export const PREFERENCES_KEY = 'preferences-storage'

export type PreferencesPayload = {
  interval?: TopInterval
  muted: boolean
  sort: FeedSort
}

type State = PreferencesPayload & {
  updatePreferences: (payload: Partial<PreferencesPayload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      muted: true,
      sort: 'best',
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
