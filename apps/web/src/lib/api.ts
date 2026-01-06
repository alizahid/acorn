import { NextResponse } from 'next/server'

import { REDIRECT_URI } from './reddit'

export function buildError(status: number, error: string, json = true) {
  if (json) {
    return NextResponse.json(
      {
        error,
      },
      {
        status,
      },
    )
  }

  const url = new URL(REDIRECT_URI)

  url.searchParams.set('error', error)

  return NextResponse.redirect(url)
}
