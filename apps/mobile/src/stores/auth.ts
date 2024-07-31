import { parseISO } from 'date-fns'
import { create as mutative } from 'mutative'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { computed } from 'zustand-computed'

import { refreshAccessToken } from '~/lib/reddit'
import { Store } from '~/lib/store'

export const AUTH_KEY = 'auth-storage'

export type Account = {
  accessToken: string
  expiresAt: Date
  id: string
  refreshToken: string
}

export type AuthPayload = Pick<
  Account,
  'accessToken' | 'expiresAt' | 'refreshToken'
> & {
  clientId: string
}

type State = Partial<AuthPayload> & {
  accountId?: string
  accounts: Array<Account>
  addAccount: (account: Account) => void
  refresh: () => Promise<void>
  removeAccount: (id: string) => Array<Account>
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
          const index = get().accounts.findIndex(
            (item) => item.id === account.id,
          )

          if (index >= 0) {
            set({
              accounts: updateAccount(get().accounts, account),
            })
          } else {
            get().accounts.push(account)
          }

          set(getAccount(account))
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
              accounts: updateAccount(get().accounts, payload),
            })
          }
        },
        removeAccount(id) {
          const accounts = get().accounts.filter((item) => item.id === id)

          set({
            accounts,
          })

          return accounts
        },
        setAccount(id) {
          const account = get().accounts.find((item) => item.id === id)

          if (account) {
            set(getAccount(account))
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

function updateAccount(accounts: Array<Account>, account: Account) {
  const index = accounts.findIndex((item) => item.id === account.id)

  return mutative(accounts, (draft) => {
    draft[index] = account
  })
}

function getAccount({ accessToken, expiresAt, id, refreshToken }: Account) {
  return {
    accessToken,
    accountId: id,
    expiresAt,
    refreshToken,
  }
}
