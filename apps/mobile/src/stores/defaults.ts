import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type FeedTypeOptions } from '~/components/home/type-menu'
import { Store } from '~/lib/store'
import { type DrawerSections, type SearchTabs } from '~/types/defaults'

export const DEFAULTS_KEY = 'defaults-storage'

export type DefaultsPayload = {
  drawerSections: DrawerSections
  homeFeed: FeedTypeOptions
  searchTabs: SearchTabs
}

type State = DefaultsPayload & {
  update: (payload: Partial<DefaultsPayload>) => void
}

export const useDefaults = create<State>()(
  persist(
    (set) => ({
      drawerSections: ['feed', 'feeds', 'communities', 'users'],
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
