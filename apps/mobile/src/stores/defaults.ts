import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type FeedTypeOptions } from '~/components/home/type-menu'
import { Store } from '~/lib/store'
import { type SearchTabs } from '~/types/search'

export const DEFAULTS_KEY = 'defaults-storage'

export type DefaultsPayload = {
  homeFeed: FeedTypeOptions
  searchTabs: SearchTabs
}

type State = DefaultsPayload & {
  update: (payload: Partial<DefaultsPayload>) => void
}

export const useDefaults = create<State>()(
  persist(
    (set) => ({
      homeFeed: {
        type: 'home',
      },
      searchTabs: ['post', 'community', 'user'],
      update(payload) {
        set(payload)
      },
    }),
    {
      name: DEFAULTS_KEY,
      storage: new Store(DEFAULTS_KEY),
    },
  ),
)
