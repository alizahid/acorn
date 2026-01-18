import { type NextRequest, NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import z from 'zod'

import { buildError } from '~/lib/api'
import { REDDIT_SCOPES, REDDIT_URL, REDIRECT_URI } from '~/lib/reddit'

const schema = z.object({
  clientId: z.string().nullish(),
  state: z.string(),
})

export async function GET(request: NextRequest) {
  const t = await getTranslations('api.auth')

  const result = schema.safeParse({
    clientId: request.nextUrl.searchParams.get('clientId'),
    state: request.nextUrl.searchParams.get('state'),
  })

  if (!result.success) {
    return buildError(400, t('invalidInput'))
  }

  const { state, clientId } = result.data

  const redirect = clientId ? REDIRECT_URI : process.env.REDDIT_REDIRECT_URL

  const url = new URL('/api/v1/authorize.compact', REDDIT_URL)

  url.searchParams.set('client_id', clientId ?? process.env.REDDIT_CLIENT_ID)
  url.searchParams.set('redirect_uri', redirect)
  url.searchParams.set('state', state)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('duration', 'permanent')
  url.searchParams.set('scope', REDDIT_SCOPES)

  return NextResponse.redirect(url)
}
