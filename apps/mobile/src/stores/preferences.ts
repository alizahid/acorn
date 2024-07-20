import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Store } from '~/lib/store'

type Payload = {
  muted: boolean
}

type State = Payload & {
  updatePreferences: (payload: Payload) => void
}

export const usePreferences = create<State>()(
  persist(
    (set) => ({
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
