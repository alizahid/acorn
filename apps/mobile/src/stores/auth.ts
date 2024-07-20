import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { compute, computed } from 'zustand-computed-state'

import { refreshAccessToken } from '~/lib/reddit'
import { Store } from '~/lib/store'

type Payload = {
  accessToken: string | null
  clientId: string | null
  expiresAt: Date | null
  refreshToken: string | null
}

type State = Payload & {
  expired: boolean
  refresh: () => Promise<Payload | null>
  save: (payload: Payload) => void
}

export const useAuth = create<State>()(
  computed(
    persist(
      (set, get) => ({
        ...compute(get, (state) => ({
          get expired() {
            const accessToken = state.accessToken
            const expiresAt = state.expiresAt
            const refreshToken = state.refreshToken

            if (!accessToken || !refreshToken || !expiresAt) {
              return true
            }

            return new Date() > expiresAt
          },
        })),
        accessToken: null,
        clientId: null,
        expiresAt: null,
        async refresh() {
          const clientId = get().clientId
          const refreshToken = get().refreshToken

          if (!clientId || !refreshToken) {
            return null
          }

          const payload = await refreshAccessToken(clientId, refreshToken)

          if (payload) {
            set(payload)
          }

          return payload
        },
        refreshToken: null,
        save(payload) {
          set(payload)
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => new Store()),
        version: 5,
      },
    ),
  ),
)
