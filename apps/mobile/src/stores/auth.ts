import { uniqBy } from 'lodash'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { queryClient } from '~/lib/query'
import { Store } from '~/lib/store'

export const AUTH_KEY = 'auth'

export type Account = {
  cookie: string
  id: string
  modHash: string
}

export type State = {
  accountId?: string
  accounts: Array<Account>
  add: (account: Account) => void
  remove: (id: string) => void
  reorder: (accounts: Array<Account>) => void
  set: (id: string) => void
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
    }),
    {
      migrate(state, version) {
        if (version < 1) {
          const previous = state as State

          previous.accountId = undefined
          previous.accounts = []
        }

        return state
      },
      name: AUTH_KEY,
      storage: new Store(),
      version: 1,
    },
  ),
)
