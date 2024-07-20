import { addSeconds } from 'date-fns'
import * as WebBrowser from 'expo-web-browser'
import { z } from 'zod'

import { REDIRECT_URI, SCOPES, USER_AGENT } from './const'

export const GetAuthCodeSchema = z.object({
  clientId: z.string().min(10),
  state: z.string(),
})

export type GetAuthCodeForm = z.infer<typeof GetAuthCodeSchema>

export async function getAuthCode(data: GetAuthCodeForm) {
  const oauth = new URL('/api/v1/authorize.compact', 'https://www.reddit.com')

  oauth.searchParams.set('client_id', data.clientId)
  oauth.searchParams.set('response_type', 'code')
  oauth.searchParams.set('duration', 'permanent')
  oauth.searchParams.set('state', data.state)
  oauth.searchParams.set('redirect_uri', REDIRECT_URI)
  oauth.searchParams.set('scope', SCOPES)

  const result = await WebBrowser.openAuthSessionAsync(
    oauth.toString(),
    REDIRECT_URI,
  )

  if (result.type !== 'success') {
    return null
  }

  const url = new URL(result.url)

  if (url.searchParams.get('state') !== data.state) {
    return null
  }

  return url.searchParams.get('code')
}

export const GetTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
})

export type GetTokenPayload = z.infer<typeof GetTokenSchema>

export async function getAccessToken(clientId: string, code: string) {
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

  const json = (await response.json()) as GetTokenPayload

  const result = GetTokenSchema.safeParse(json)

  if (!result.success) {
    return null
  }

  return {
    accessToken: result.data.access_token,
    clientId,
    expiresAt: addSeconds(new Date(), result.data.expires_in - 100),
    refreshToken: result.data.refresh_token,
  }
}

export async function refreshAccessToken(clientId: string, token: string) {
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

  const json = (await response.json()) as GetTokenPayload

  const result = GetTokenSchema.safeParse(json)

  if (!result.success) {
    return null
  }

  return {
    accessToken: result.data.access_token,
    clientId,
    expiresAt: addSeconds(new Date(), result.data.expires_in - 100),
    refreshToken: result.data.refresh_token,
  }
}

export async function redditApi<Response>(
  url: string | URL,
  accessToken: string | null,
) {
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${String(accessToken)}`,
      'user-agent': USER_AGENT,
    },
  })

  return (await response.json()) as Response
}
