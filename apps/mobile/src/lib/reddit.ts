import { addSeconds } from 'date-fns'
import * as WebBrowser from 'expo-web-browser'
import { z } from 'zod'

import { type ProfileSchema } from '~/schemas/reddit/profile'
import { type Account } from '~/stores/auth'

export const REDIRECT_URI = 'acorn://login'
export const USER_AGENT = 'ios:blue.acorn:v1.0.0'

export const REDDIT_URI = 'https://oauth.reddit.com'
export const REDDIT_SCOPES = [
  'history',
  'identity',
  'mysubreddits',
  'read',
  'report',
  'save',
  'subscribe',
  'vote',
].join(' ')

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
  oauth.searchParams.set('scope', REDDIT_SCOPES)

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

export async function getAccessToken(
  clientId: string,
  code: string,
): Promise<Account | null> {
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
): Promise<Account | null> {
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

async function getAccountName(accessToken: string) {
  const response = await redditApi<ProfileSchema>({
    accessToken,
    url: '/api/v1/me',
  })

  if (!response) {
    return null
  }

  return response.name
}

type ApiProps = {
  accessToken?: string
  body?: FormData
  method?: 'get' | 'post'
  url: string | URL
}

export async function redditApi<Response>({
  accessToken,
  body,
  method = 'get',
  url,
}: ApiProps) {
  if (!accessToken) {
    return null
  }

  const headers = new Headers()

  headers.set('authorization', `Bearer ${String(accessToken)}`)
  headers.set('user-agent', USER_AGENT)

  const request: RequestInit = {
    headers,
    method,
  }

  if (body) {
    request.body = body

    headers.set('content-type', 'multipart/form-data')
  }

  const input = new URL(url, REDDIT_URI)

  input.searchParams.set('g', 'GLOBAL')

  const response = await fetch(input, request)

  return (await response.json()) as Response
}

const prefixes = {
  account: 't2_',
  award: 't6_',
  comment: 't1_',
  link: 't3_',
  message: 't4_',
  subreddit: 't5_',
} as const

export function addPrefix(id: string, type: keyof typeof prefixes) {
  const prefix = prefixes[type]

  if (id.startsWith(prefix)) {
    return id
  }

  return prefix + id
}

export function removePrefix(id: string) {
  return id.split('_').pop()!
}
