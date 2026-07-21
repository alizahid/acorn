import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Store } from '~/lib/store'
import { type DrawerSections, type SearchTabs } from '~/types/defaults'
import { type FeedType } from '~/types/sort'

const DEFAULTS_KEY = 'defaults'

type DefaultsPayload = {
  community?: string
  drawerSections: DrawerSections
  feed?: string
  feedType: FeedType
  searchTabs: SearchTabs
}

type State = DefaultsPayload & {
  update: (payload: Partial<DefaultsPayload>) => void
}

export const useDefaults = create<State>()(
  persist(
    (set) => ({
      drawerSections: [
        {
          disabled: false,
          key: 'feed',
        },
        {
          disabled: false,
          key: 'feeds',
        },
        {
          disabled: false,
          key: 'communities',
        },
      ],
      feedType: 'home',
      searchTabs: [
        {
          disabled: false,
          key: 'post',
        },
        {
          disabled: false,
          key: 'community',
        },
        {
          disabled: false,
          key: 'user',
        },
      ],
      update(payload) {
        set(payload)
      },
    }),
    {
      name: DEFAULTS_KEY,
      storage: new Store(),
    },
  ),
)
