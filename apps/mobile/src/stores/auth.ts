import { parseISO } from 'date-fns'
import { create as mutative } from 'mutative'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { computed } from 'zustand-computed'

import { queryClient } from '~/lib/query'
import { refreshAccessToken } from '~/lib/reddit'
import { Store } from '~/lib/store'

export const AUTH_KEY = 'auth-storage'

export type Account = {
  accessToken: string
  expiresAt: Date
  id: string
  refreshToken: string
}

export type AuthPayload = Omit<Account, 'id'> & {
  clientId: string
}

type State = Partial<AuthPayload> & {
  accountId?: string
  accounts: Array<Account>
  addAccount: (account: Account) => void
  refresh: () => Promise<void>
  removeAccount: (id: string) => void
  setAccount: (id: string) => void
  setClientId: (clientId: string) => void
}

function compute(state: State) {
  const { accessToken, refreshToken } = state

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
        accounts: [],
        addAccount(account) {
          set({
            accounts: updateAccounts(get().accounts, account),
          })
        },
        async refresh() {
          const { clientId, refreshToken } = get()

          if (!clientId || !refreshToken) {
            return
          }

          const payload = await refreshAccessToken(clientId, refreshToken)

          if (payload) {
            set({
              ...getAccount(payload),
              accounts: updateAccounts(get().accounts, payload),
            })
          }
        },
        removeAccount(id) {
          const accounts = get().accounts.filter((item) => item.id !== id)

          if (accounts.length === 0) {
            queryClient.clear()
          } else if (get().accountId === id) {
            const next = accounts.at(0)

            set({
              ...getAccount(next),
              accounts,
            })

            queryClient.clear()
          } else {
            set({
              accounts,
            })
          }
        },
        setAccount(id) {
          const account = get().accounts.find((item) => item.id === id)

          if (account) {
            set(getAccount(account))

            queryClient.clear()
          }
        },
        setClientId(clientId) {
          set({
            clientId,
          })
        },
      }),
      {
        name: AUTH_KEY,
        storage: createJSONStorage(() => new Store(AUTH_KEY)),
      },
    ),
    compute,
  ),
)

function updateAccounts(accounts: Array<Account>, account: Account) {
  return mutative(accounts, (draft) => {
    const index = accounts.findIndex((item) => item.id === account.id)

    if (index >= 0) {
      draft[index] = account
    } else {
      draft.push(account)
    }
  })
}

function getAccount(account?: Account) {
  return {
    accessToken: account?.accessToken,
    accountId: account?.id,
    expiresAt: account?.expiresAt,
    refreshToken: account?.refreshToken,
  }
}
