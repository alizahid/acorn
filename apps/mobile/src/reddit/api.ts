import { testFlight } from '~/lib/common'
import { getAccount, updateAccounts, useAuth } from '~/stores/auth'

import { REDDIT_URI, USER_AGENT } from './config'
import { refreshAccessToken as refreshAppStore } from './token-app-store'
import { refreshAccessToken as refreshTestFlight } from './token-test-flight'

type Props = {
  accessToken?: string
  body?: FormData
  method?: 'get' | 'post'
  url: string | URL
}

export async function reddit<Response>({
  accessToken,
  body,
  method = 'get',
  url,
}: Props) {
  let token = accessToken ?? useAuth.getState().accessToken

  if (!token) {
    return
  }

  const expired = checkExpiry(Boolean(accessToken))

  if (expired) {
    token = await refresh()
  }

  if (!token) {
    return
  }

  const headers = new Headers()

  headers.set('authorization', `Bearer ${String(token)}`)
  headers.set('user-agent', USER_AGENT)

  const request: RequestInit = {
    headers,
    method,
  }

  if (body) {
    request.body = body

    headers.set('content-type', 'multipart/form-data')
  }

  const input = new URL(url, REDDIT_URI)

  input.searchParams.set('g', 'GLOBAL')

  // biome-ignore lint/correctness/noUndeclaredVariables: go away
  if (__DEV__) {
    // biome-ignore lint/suspicious/noConsole: go away
    console.log('reddit', input.toString(), request)
  }

  const response = await fetch(input, request)

  if (url === '/api/read_all_messages') {
    return {} as Response
  }

  if (response.status >= 400) {
    const json = (await response.json()) as {
      message?: string
    }

    throw new Error(json.message ?? response.statusText)
  }

  return (await response.json()) as Response
}

function checkExpiry(skip?: boolean) {
  if (skip) {
    return false
  }

  const { accessToken, expiresAt, refreshToken } = useAuth.getState()

  if (!(accessToken && refreshToken && expiresAt)) {
    return true
  }

  return new Date() > expiresAt
}

async function refresh() {
  const { clientId, refreshToken } = useAuth.getState()

  const payload = testFlight
    ? !!clientId && !!refreshToken
      ? await refreshTestFlight(clientId, refreshToken)
      : refreshToken
        ? await refreshAppStore(refreshToken)
        : null
    : null

  if (!payload) {
    return
  }

  useAuth.setState({
    ...getAccount(payload),
    accounts: updateAccounts(useAuth.getState().accounts, payload),
  })

  return payload.accessToken
}
