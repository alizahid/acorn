import { addSeconds } from 'date-fns'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as SecureStore from 'expo-secure-store'

import { CLIENT_ID_KEY } from '~/hooks/purchases/client-id'
import { testFlight } from '~/lib/common'
import { TokenSchema } from '~/schemas/token'
import { type Account } from '~/stores/auth'
import { type Nullable } from '~/types'

import { getAccountName } from './name'

export async function refreshAccessToken(
  token: string,
): Promise<Nullable<Account>> {
  const url = new URL('/api/auth/refresh', process.env.EXPO_PUBLIC_WEB_URL)

  const data = new FormData()

  data.append('token', token)

  if (testFlight) {
    const clientId = await SecureStore.getItemAsync(CLIENT_ID_KEY)

    if (clientId) {
      data.append('clientId', clientId)
    }
  }

  const response = await fetch(url, {
    body: data,
    method: 'post',
  })

  const json = (await response.json()) as TokenSchema

  const result = TokenSchema.safeParse(json)

  if (!result.success) {
    return null
  }

  const id = await getAccountName(result.data.access_token)

  if (!id) {
    return null
  }

  return {
    accessToken: result.data.access_token,
    expiresAt: addSeconds(new Date(), result.data.expires_in - 60),
    id,
    refreshToken: result.data.refresh_token,
  }
}
