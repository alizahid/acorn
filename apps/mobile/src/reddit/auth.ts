import * as WebBrowser from 'expo-web-browser'
import { z } from 'zod'

import { REDDIT_SCOPES, REDIRECT_URI } from './config'

export const AuthCodeSchema = z.object({
  clientId: z.string().min(10),
  state: z.string(),
})

export type AuthCodeForm = z.infer<typeof AuthCodeSchema>

export async function getAuthCode(data: AuthCodeForm) {
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
