import { type NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'

import { getAuth, REDDIT_URL } from '~/lib/reddit'

export async function POST(request: NextRequest) {
  const t = await getTranslations('api.auth')

  const { token } = (await request.json()) as {
    token: string
  }

  if (!token) {
    return buildError(400, t('tokenNotFound'))
  }

  const oauth = new URL('/api/v1/access_token', REDDIT_URL)

  const data = new FormData()

  data.append('grant_type', 'refresh_token')
  data.append('refresh_token', token)
  data.append('redirect_uri', process.env.REDDIT_REDIRECT_URL)

  const response = await fetch(oauth, {
    body: data,
    headers: {
      authorization: getAuth(),
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

function buildError(status: number, error: string) {
  return NextResponse.json(
    {
      error,
    },
    {
      status,
    },
  )
}
