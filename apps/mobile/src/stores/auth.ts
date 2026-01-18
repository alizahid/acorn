import { create as mutative } from 'mutative'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { queryClient } from '~/lib/query'
import { Store } from '~/lib/store'

export const AUTH_KEY = 'auth-storage'

export type Account = {
  accessToken: string
  expiresAt: Date
  id: string
  refreshToken: string
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
          accounts: updateAccounts(get().accounts, account),
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
      name: AUTH_KEY,
      storage: new Store(),
    },
  ),
)

export function updateAccounts(accounts: Array<Account>, account: Account) {
  return mutative(accounts, (draft) => {
    const index = accounts.findIndex((item) => item.id === account.id)

    if (index >= 0) {
      draft[index] = account
    } else {
      draft.push(account)
    }
  })
}
