import { exchangeSessionCookie, Reddit } from '@acorn/reddit'
import { isAfter } from 'date-fns'
import crypto from 'react-native-nitro-crypto'

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
    const next = await exchangeSessionCookie({
      cookie: account.cookie,
      loid: account.loid,
    })

    useAuth.getState().update(account.id, next)

    return next
  } finally {
    refreshing.delete(account.id)
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
