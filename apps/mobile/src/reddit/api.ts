import { Reddit } from '@acorn/reddit'
import { isAfter } from 'date-fns'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as Crypto from 'expo-crypto'

import { useAuth } from '~/stores/auth'

import { refreshToken } from './token'

export const REDDIT_URI = 'https://www.reddit.com'
export const REDDIT_OLD_URI = 'https://old.reddit.com'

export async function createApi() {
  const { accountId, accounts } = useAuth.getState()

  if (!accountId) {
    return
  }

  const account = accounts.find((item) => item.id === accountId)

  if (!account) {
    return
  }

  if (isAfter(new Date(), account.expiresAt)) {
    const { expiresAt, token } = await refreshToken(account.cookie)

    useAuth.getState().add({
      ...account,
      expiresAt,
      token,
    })

    return new Reddit({
      deviceId: Crypto.randomUUID(),
      token,
    })
  }

  return new Reddit({
    deviceId: Crypto.randomUUID(),
    token: account.token,
  })
}
