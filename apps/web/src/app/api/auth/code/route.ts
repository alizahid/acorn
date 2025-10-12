import { type NextRequest, NextResponse } from 'next/server'

import { REDDIT_SCOPES, REDDIT_URL } from '~/lib/reddit'

export function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get('state')

  if (!state) {
    return NextResponse.json(
      {
        error: 'Invalid input',
      },
      {
        status: 400,
      },
    )
  }

  const url = new URL('/api/v1/authorize.compact', REDDIT_URL)

  url.searchParams.set('client_id', process.env.REDDIT_CLIENT_ID)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('duration', 'permanent')
  url.searchParams.set('state', state)
  url.searchParams.set('redirect_uri', process.env.REDDIT_REDIRECT_URL)
  url.searchParams.set('scope', REDDIT_SCOPES)

  return NextResponse.redirect(url)
}
