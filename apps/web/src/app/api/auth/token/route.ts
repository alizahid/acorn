import { type NextRequest, NextResponse } from 'next/server'
import { type _Translator, type Messages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { z } from 'zod'

import { buildError } from '~/lib/api'
import {
  getAuth,
  getId,
  REDDIT_URL,
  REDIRECT_URI,
  USER_AGENT,
} from '~/lib/reddit'

const GetSchema = z.object({
  code: z.string(),
  state: z.string(),
})

export async function GET(request: NextRequest) {
  const t = await getTranslations('api.auth')

  const result = GetSchema.safeParse({
    code: request.nextUrl.searchParams.get('code'),
  })

  if (!result.success) {
    return buildError(400, t('codeNotFound'), false)
  }

  const { code, state } = result.data

  try {
    const account = await getAccount(t, code)

    const url = new URL(REDIRECT_URI)

    url.searchParams.set('state', state)
    url.searchParams.set('id', account.id)
    url.searchParams.set('accessToken', account.accessToken)
    url.searchParams.set('refreshToken', account.refreshToken)
    url.searchParams.set('expiresAt', String(account.expiresIn))

    return NextResponse.redirect(url)
  } catch (error) {
    return buildError(
      500,
      error instanceof Error ? error.message : t('unknownError'),
      false,
    )
  }
}

const PostSchema = z.object({
  clientId: z.string(),
  code: z.string(),
})

export async function POST(request: NextRequest) {
  const t = await getTranslations('api.auth')

  const result = PostSchema.safeParse(await request.json())

  if (!result.success) {
    return buildError(400, t('codeNotFound'))
  }

  const { code, clientId } = result.data

  try {
    const account = await getAccount(t, code, clientId)

    return NextResponse.json({
      accessToken: account.accessToken,
      expiresAt: String(account.expiresIn),
      id: account.id,
      refreshToken: account.refreshToken,
    })
  } catch (error) {
    return buildError(
      500,
      error instanceof Error ? error.message : t('unknownError'),
    )
  }
}

async function getAccount(
  t: _Translator<Messages, 'api.auth'>,
  code: string,
  clientId?: string,
) {
  const redirect = clientId ? REDIRECT_URI : process.env.REDDIT_REDIRECT_URL

  const url = new URL('/api/v1/access_token', REDDIT_URL)

  const data = new FormData()

  data.append('grant_type', 'authorization_code')
  data.append('code', code)
  data.append('redirect_uri', redirect)

  const response = await fetch(url.toString(), {
    body: data,
    headers: {
      authorization: getAuth(clientId),
      'user-agent': USER_AGENT,
    },
    method: 'post',
  })

  const payload = (await response.json()) as
    | {
        access_token: string
        expires_in: number
        refresh_token: string
      }
    | {
        error: number
        message: string
      }

  if ('error' in payload) {
    throw new Error(
      t('apiError', {
        error: payload.message,
      }),
    )
  }

  const id = await getId(payload.access_token)

  if (!id) {
    throw new Error(t('idNotFound'))
  }

  return {
    accessToken: payload.access_token,
    expiresIn: payload.expires_in,
    id,
    refreshToken: payload.refresh_token,
  }
}
