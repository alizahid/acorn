import { uniqBy } from 'lodash'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { queryClient } from '~/lib/query'
import { Store } from '~/lib/store'

const AUTH_KEY = 'auth'

export type Account = {
  cookie: string
  expiresAt: Date
  id: string
  token: string
}

export type AuthPayload = {
  accountId?: string
  accounts: Array<Account>
}

export type State = AuthPayload & {
  add: (account: Account) => void
  remove: (id: string) => void
  reorder: (accounts: Array<Account>) => void
  set: (id: string) => void
  update: (id: string, token: Pick<Account, 'expiresAt' | 'token'>) => void
}

export const useAuth = create<State>()(
  persist(
    (set, get) => ({
      accounts: [],
      add(account) {
        set({
          accountId: account.id,
          accounts: uniqBy([account, ...get().accounts], 'id'),
        })
      },
      remove(id) {
        const accounts = get().accounts.filter((item) => item.id !== id)

        if (accounts.length === 0) {
          set({
            accountId: undefined,
            accounts,
          })
        } else if (get().accountId === id) {
          set({
            accountId: accounts[0]?.id,
            accounts,
          })
        } else {
          set({
            accounts,
          })
        }

        queryClient.invalidateQueries({
          queryKey: ['purchases', 'subscribed'],
        })
      },
      reorder(accounts) {
        set({
          accounts,
        })
      },
      set(id) {
        const account = get().accounts.find((item) => item.id === id)

        if (account) {
          set({
            accountId: account.id,
          })

          queryClient.clear()
        }
      },
      update(id, token) {
        set({
          accounts: get().accounts.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...token,
                }
              : item,
          ),
        })
      },
    }),
    {
      migrate(state, version) {
        if (version < 1) {
          const previous = state as State

          previous.accountId = undefined
          previous.accounts = []
        }

        // cookie-only accounts: expire them so createApi fetches a token
        if (version < 2) {
          const previous = state as State

          previous.accounts = previous.accounts.map((account) => ({
            ...account,
            expiresAt: new Date(0),
            token: '',
          }))
        }

        return state
      },
      name: AUTH_KEY,
      storage: new Store(),
      version: 2,
    },
  ),
)
