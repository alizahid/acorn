import { createId } from '@paralleldrive/cuid2'
import { addSeconds } from 'date-fns'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as WebBrowser from 'expo-web-browser'

import { REDIRECT_URI } from './config'

type Props = {
  accent?: string
  background?: string
}

export async function authenticate({ accent, background }: Props) {
  const state = createId()

  const oauth = new URL('/api/auth/code', process.env.EXPO_PUBLIC_WEB_URL)

  oauth.searchParams.set('state', state)

  const result = await WebBrowser.openAuthSessionAsync(
    oauth.toString(),
    REDIRECT_URI,
    {
      controlsColor: accent,
      preferEphemeralSession: true,
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      toolbarColor: background,
    },
  )

  if (result.type !== 'success') {
    return null
  }

  const url = new URL(result.url)

  const error = url.searchParams.get('error')

  if (error) {
    throw new Error(error)
  }

  if (url.searchParams.get('state') !== state) {
    return null
  }

  const id = url.searchParams.get('id')
  const accessToken = url.searchParams.get('accessToken')
  const refreshToken = url.searchParams.get('refreshToken')
  const expiresAt = url.searchParams.get('expiresAt')

  if (!(id && accessToken && refreshToken && expiresAt)) {
    return null
  }

  return {
    accessToken,
    expiresAt: addSeconds(new Date(), Number(expiresAt) - 60),
    id,
    refreshToken,
  }
}
