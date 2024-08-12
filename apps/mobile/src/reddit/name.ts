import { REDDIT_URI, USER_AGENT } from './config'

export async function getAccountName(accessToken: string) {
  const url = new URL('/api/v1/me', REDDIT_URI)

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      'user-agent': USER_AGENT,
    },
  })

  const json = (await response.json()) as
    | {
        name: string
      }
    | undefined

  return json?.name
}
