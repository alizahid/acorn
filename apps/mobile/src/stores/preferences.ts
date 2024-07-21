import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { type FeedType } from '~/hooks/data/feed'
import { Store } from '~/lib/store'

type Payload = {
  feed: FeedType
  muted: boolean
}

type State = Payload & {
  updatePreferences: (payload: Partial<Payload>) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
      feed: 'rising',
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
