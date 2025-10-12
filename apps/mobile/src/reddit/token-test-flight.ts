import { addSeconds } from 'date-fns'

import { TokenSchema } from '~/schemas/token'
import { type Account } from '~/stores/auth'
import { type Nullable } from '~/types'

import { REDIRECT_URI } from './config'
import { getAccountName } from './name'

export async function getAccessToken(
  clientId: string,
  code: string,
): Promise<Nullable<Account>> {
  const url = new URL('/api/v1/access_token', 'https://www.reddit.com')

  const data = new FormData()

  data.append('grant_type', 'authorization_code')
  data.append('code', code)
  data.append('redirect_uri', REDIRECT_URI)

  const response = await fetch(url, {
    body: data,
    headers: {
      authorization: `Basic ${btoa(`${clientId}:`)}`,
    },
    method: 'post',
  })

  const json = (await response.json()) as TokenSchema

  const result = TokenSchema.safeParse(json)

  if (!result.success) {
    return null
  }

  const id = await getAccountName(result.data.access_token)

  if (!id) {
    return null
  }

  return {
    accessToken: result.data.access_token,
    expiresAt: addSeconds(new Date(), result.data.expires_in - 60),
    id,
    refreshToken: result.data.refresh_token,
  }
}

export async function refreshAccessToken(
  clientId: string,
  token: string,
): Promise<Nullable<Account>> {
  const url = new URL('/api/v1/access_token', 'https://www.reddit.com')

  const data = new FormData()

  data.append('grant_type', 'refresh_token')
  data.append('refresh_token', token)
  data.append('redirect_uri', REDIRECT_URI)

  const response = await fetch(url, {
    body: data,
    headers: {
      authorization: `Basic ${btoa(`${clientId}:`)}`,
    },
    method: 'post',
  })

  const json = (await response.json()) as TokenSchema

  const result = TokenSchema.safeParse(json)

  if (!result.success) {
    return null
  }

  const id = await getAccountName(result.data.access_token)

  if (!id) {
    return null
  }

  return {
    accessToken: result.data.access_token,
    expiresAt: addSeconds(new Date(), result.data.expires_in - 60),
    id,
    refreshToken: result.data.refresh_token,
  }
}
