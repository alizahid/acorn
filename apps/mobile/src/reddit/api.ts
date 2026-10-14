import { Reddit, USER_AGENT } from '@acorn/reddit'
import { addSeconds, isAfter } from 'date-fns'
import crypto from 'react-native-nitro-crypto'
import { z } from 'zod'

import { mmkv } from '~/lib/mmkv'
import { type Account, useAuth } from '~/stores/auth'

export const REDDIT_URI = 'https://www.reddit.com'
export const REDDIT_OLD_URI = 'https://old.reddit.com'

const refreshing = new Map<string, ReturnType<typeof refreshToken>>()

type CreateProps = {
  edgeBucket?: string
  loid: string
  token: string
}

export async function createApi(props?: CreateProps) {
  if (props) {
    return new Reddit({
      deviceId: getDeviceId(),
      edgeBucket: props.edgeBucket,
      loid: props.loid,
      token: props.token,
    })
  }

  const { accountId, accounts } = useAuth.getState()

  const account = accounts.find((item) => item.id === accountId)

  if (!account) {
    throw new Error('Not signed in')
  }

  if (isAfter(new Date(), account.expiresAt)) {
    let refresh = refreshing.get(account.id)

    if (!refresh) {
      refresh = refreshToken(account)

      refreshing.set(account.id, refresh)
    }

    const { edgeBucket, loid, token } = await refresh

    return new Reddit({
      deviceId: getDeviceId(),
      edgeBucket,
      loid,
      token,
    })
  }

  return new Reddit({
    deviceId: getDeviceId(),
    edgeBucket: account.edgeBucket,
    loid: account.loid,
    token: account.token,
  })
}

async function refreshToken(account: Account) {
  try {
    const next = await fetchToken(account.cookie)

    useAuth.getState().update(account.id, next)

    return next
  } finally {
    refreshing.delete(account.id)
  }
}

const TokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  loid: z.string(),
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
        Authorization: 'Basic b2hYcG9xclpZdWIxa2c6',
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

  const json = await response.json()

  const { access_token, expires_in, loid } = TokenSchema.parse({
    ...json,
    loid: response.headers.get('x-reddit-loid'),
  })

  return {
    edgeBucket: getBucket(response),
    expiresAt: addSeconds(new Date(), expires_in - 3600),
    loid,
    token: access_token,
  }
}

const KEY_DEVICE_ID = 'device-id'

function getDeviceId() {
  const exists = mmkv.getString(KEY_DEVICE_ID)

  if (exists) {
    return exists
  }

  const deviceId = crypto.randomUUID()

  mmkv.set(KEY_DEVICE_ID, deviceId)

  return deviceId
}

function getBucket(response: Response) {
  const cookie = response.headers.get('set-cookie')

  if (!cookie) {
    return
  }

  const { edgebucket } = Object.fromEntries(
    cookie
      .split(';')
      .map((item) => item.trim())
      .map((item) => item.split('=')),
  )

  if (typeof edgebucket === 'string') {
    return edgebucket
  }
}
