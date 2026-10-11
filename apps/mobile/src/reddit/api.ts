import { Reddit, USER_AGENT } from '@acorn/reddit'
import { addSeconds, isAfter } from 'date-fns'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as Crypto from 'expo-crypto'
import { z } from 'zod'

import { mmkv } from '~/lib/mmkv'
import { useAuth } from '~/stores/auth'

export const REDDIT_URI = 'https://www.reddit.com'
export const REDDIT_OLD_URI = 'https://old.reddit.com'

// token refreshes in flight, by account: queries that start together after the
// token expires share one instead of each fetching their own
const refreshing = new Map<string, Promise<string>>()

export async function createApi() {
  const { accountId, accounts } = useAuth.getState()

  const account = accounts.find((item) => item.id === accountId)

  if (!account) {
    throw new Error('Not signed in')
  }

  if (isAfter(new Date(), account.expiresAt)) {
    let refresh = refreshing.get(account.id)

    if (!refresh) {
      refresh = fetchToken(account.cookie)
        .then((next) => {
          useAuth.getState().update(account.id, next)

          return next.token
        })
        .finally(() => {
          refreshing.delete(account.id)
        })

      refreshing.set(account.id, refresh)
    }

    return new Reddit({
      deviceId: getDeviceId(),
      token: await refresh,
    })
  }

  return new Reddit({
    deviceId: getDeviceId(),
    token: account.token,
  })
}

const TokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
})

export async function fetchToken(cookie: string) {
  const response = await fetch(
    'https://www.reddit.com/auth/v2/oauth/access-token/session',
    {
      body: JSON.stringify({
        scopes: ['*', 'email', 'pii'],
      }),
      credentials: 'omit',
      headers: {
        Authorization: 'Basic TE5EbzlrMW84VUFFVXc6',
        'Content-Type': 'application/json',
        Cookie: `reddit_session=${cookie}`,
        'User-Agent': USER_AGENT,
      },
      method: 'post',
    },
  )

  if (!response.ok) {
    throw new Error(`Token refresh failed (HTTP ${response.status})`)
  }

  const { access_token, expires_in } = TokenSchema.parse(await response.json())

  return {
    expiresAt: addSeconds(new Date(), expires_in - 3600),
    token: access_token,
  }
}

function getDeviceId() {
  const KEY = 'device-id'

  const exists = mmkv.getString(KEY)

  if (exists) {
    return exists
  }

  const deviceId = Crypto.randomUUID()

  mmkv.set(KEY, deviceId)

  return deviceId
}
