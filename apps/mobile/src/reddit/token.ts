import { USER_AGENT } from '@acorn/reddit'
import { addSeconds } from 'date-fns'
import { z } from 'zod'

const schema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
})

export async function refreshToken(cookie: string) {
  const response = await fetch(
    'https://www.reddit.com/auth/v2/oauth/access-token/session',
    {
      headers: {
        Authorization: 'Basic TE5EbzlrMW84VUFFVXc6',
        Cookie: cookie,
        'User-Agent': USER_AGENT,
      },
      method: 'post',
    },
  )

  const { access_token, expires_in } = schema.parse(await response.json())

  return {
    expiresAt: addSeconds(new Date(), expires_in - 3600),
    token: access_token,
  }
}
