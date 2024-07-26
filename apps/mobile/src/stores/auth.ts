import { parseISO } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { computed } from 'zustand-computed'

import { refreshAccessToken } from '~/lib/reddit'
import { Store } from '~/lib/store'

export const AUTH_KEY = 'auth-storage'

export type AuthPayload = {
  accessToken: string | null
  clientId: string | null
  expiresAt: Date | null
  refreshToken: string | null
}

type State = AuthPayload & {
  refresh: () => Promise<void>
  save: (payload: AuthPayload) => void
}

function compute(state: State) {
  const accessToken = state.accessToken
  const refreshToken = state.refreshToken
  const expiresAt =
    typeof state.expiresAt === 'string'
      ? parseISO(state.expiresAt)
      : state.expiresAt

  return {
    expired:
      !accessToken || !refreshToken || !expiresAt
        ? true
        : new Date() > expiresAt,
  }
}

export const useAuth = create<State>()(
  computed(
    persist(
      (set, get) => ({
        accessToken: null,
        clientId: null,
        expiresAt: null,
        async refresh() {
          const clientId = get().clientId
          const refreshToken = get().refreshToken

          if (!clientId || !refreshToken) {
            return
          }

          const payload = await refreshAccessToken(clientId, refreshToken)

          if (payload) {
            set(payload)
          }
        },
        refreshToken: null,
        save(payload) {
          set(payload)
        },
      }),
      {
        name: AUTH_KEY,
        storage: createJSONStorage(() => new Store()),
      },
    ),
    compute,
  ),
)
