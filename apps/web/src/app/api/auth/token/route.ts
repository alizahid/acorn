import { type NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'

import { getAuth, getId, REDDIT_URL, REDIRECT_URI } from '~/lib/reddit'

export async function GET(request: NextRequest) {
  const t = await getTranslations('api.auth')

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')

  if (!(code && state)) {
    return buildError(t('codeNotFound'))
  }

  const oauth = new URL('/api/v1/access_token', REDDIT_URL)

  const data = new FormData()

  data.append('grant_type', 'authorization_code')
  data.append('code', code)
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
      t('apiError', {
        error: json.message,
      }),
    )
  }

  const id = await getId(json.access_token)

  if (!id) {
    return buildError(t('idNotFound'))
  }

  const url = new URL(REDIRECT_URI)

  url.searchParams.set('id', id)
  url.searchParams.set('accessToken', json.access_token)
  url.searchParams.set('refreshToken', json.refresh_token)
  url.searchParams.set('expiresAt', String(json.expires_in))
  url.searchParams.set('state', state)

  return NextResponse.redirect(url)
}

function buildError(error: string) {
  const url = new URL(REDIRECT_URI)

  url.searchParams.set('error', error)

  return NextResponse.redirect(url)
}
