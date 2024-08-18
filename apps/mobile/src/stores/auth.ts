import AsyncStorage from '@react-native-async-storage/async-storage'
import { parseISO } from 'date-fns'
import { create as mutative } from 'mutative'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { CACHE_KEY, queryClient } from '~/lib/query'
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

export type State = Partial<AuthPayload> & {
  accountId?: string
  accounts: Array<Account>
  addAccount: (account: Account) => void
  clearCache: () => void
  removeAccount: (id: string) => void
  setAccount: (id: string) => void
  setClientId: (clientId: string) => void
}

export const useAuth = create<State>()(
  persist(
    (set, get) => ({
      accounts: [],
      addAccount(account) {
        set({
          ...getAccount(account),
          accounts: updateAccounts(get().accounts, account),
        })
      },
      clearCache() {
        queryClient.clear()

        void AsyncStorage.removeItem(CACHE_KEY)
      },
      removeAccount(id) {
        const accounts = get().accounts.filter((item) => item.id !== id)

        if (accounts.length === 0) {
          set({
            ...getAccount(),
            accounts,
          })
        } else if (get().accountId === id) {
          const next = accounts[0]

          set({
            ...getAccount(next),
            accounts,
          })
        } else {
          set({
            accounts,
          })
        }
      },
      setAccount(id) {
        const account = get().accounts.find((item) => item.id === id)

        if (account) {
          set({
            ...getAccount(account),
          })
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
      storage: new Store(AUTH_KEY),
    },
  ),
)

export function updateAccounts(accounts: Array<Account>, account: Account) {
  return mutative(accounts, (draft) => {
    const index = accounts.findIndex((item) => item.id === account.id)

    if (index >= 0) {
      draft[index] = {
        ...account,
        expiresAt:
          typeof account.expiresAt === 'string'
            ? parseISO(account.expiresAt)
            : account.expiresAt,
      }
    } else {
      draft.push({
        ...account,
        expiresAt:
          typeof account.expiresAt === 'string'
            ? parseISO(account.expiresAt)
            : account.expiresAt,
      })
    }
  })
}

export function getAccount(account?: Account) {
  const expiresAt =
    typeof account?.expiresAt === 'string'
      ? parseISO(account.expiresAt)
      : account?.expiresAt

  return {
    accessToken: account?.accessToken,
    accountId: account?.id,
    expiresAt,
    refreshToken: account?.refreshToken,
  }
}
