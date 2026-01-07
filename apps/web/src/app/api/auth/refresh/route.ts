import { type NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import z from 'zod'

import { buildError } from '~/lib/api'
import { getAuth, REDDIT_URL, REDIRECT_URI, USER_AGENT } from '~/lib/reddit'

const schema = z.object({
  clientId: z.string().nullish(),
  token: z.string(),
})

export async function POST(request: NextRequest) {
  const t = await getTranslations('api.auth')

  const result = schema.safeParse(await request.json())

  if (!result.success) {
    return buildError(400, t('tokenNotFound'))
  }

  const { token, clientId } = result.data

  const redirect = clientId ? REDIRECT_URI : process.env.REDDIT_REDIRECT_URL

  const url = new URL('/api/v1/access_token', REDDIT_URL)

  const data = new FormData()

  data.append('grant_type', 'refresh_token')
  data.append('refresh_token', token)
  data.append('redirect_uri', redirect)

  const response = await fetch(url, {
    body: data,
    headers: {
      authorization: getAuth(clientId),
      'user-agent': USER_AGENT,
    },
    method: 'post',
  })

  const json = (await response.json()) as
    | {
        access_token: string
        expires_in: number
        refresh_token: string
      }
    | {
        error: number
        message: string
      }

  if ('error' in json) {
    return buildError(
      json.error,
      t('apiError', {
        error: json.message,
      }),
    )
  }

  return NextResponse.json(json)
}
